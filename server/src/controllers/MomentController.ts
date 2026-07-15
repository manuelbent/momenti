import { Request, Response } from 'express'
import logger from '../config/logger'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import User from '../models/User'

/**
 * @class MomentController
 */
export default class MomentController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     * @param {ChangeServiceInterface} changeService
     * @param {StreamWorkerInterface} streamWorker
     */
    constructor(
        private momentService: MomentServiceInterface,
        private changeService: ChangeServiceInterface,
        private streamWorker: StreamWorkerInterface,
    ) {}

    /**
     * Load all moments by invite key.
     * @param {Request} _
     * @param {Response} res
     */
    public async loadAll(_: Request, res: Response) {
        try {
            const user: User = res.locals.user
            const moments = await user.getMoments({ order: [['created_at', 'DESC']] })
            res.json(moments)
        } catch (err) {
            logger.error({ err }, '[MomentController] load all moments error')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * This function is public, because consumed by the viewer.
     * A moment is loaded by slug, if published.
     * @param {Request} req
     * @param {Response} res
     */
    public async loadPublishedBySlug(req: Request, res: Response) {
        try {
            const slug = String(req.params.slug)
            const moment = await this.momentService.getPublishedBySlug(slug)
            res.json(moment)
        } catch (err) {
            logger.error({ err }, '[MomentController] load moment by slug')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * Load all changes for a moment.
     * @param {Request} req
     * @param {Response} res
     */
    public async loadChanges(req: Request, res: Response) {
        try {
            const { id } = req.params
            const changes = await this.changeService.getAll(Number(id))
            res.json(changes)
        } catch (err) {
            logger.error({ err }, '[MomentController] load changes error')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * Update the moment.
     * @param {Request} req
     * @param {Response} res
     */
    public async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            const moment = await this.momentService.update(id, req.body)
            res.json(moment)
        } catch (err) {
            logger.error({ err }, '[MomentController] update error')
            res.status(404).json({ error: 'Moment not found.' })
        }
    }

    /**
     * Check if a slug already exists.
     * @param {Request} req
     * @param {Response} res
     */
    public async checkSlug(req: Request, res: Response) {
        try {
            const { slug, excludedId } = req.query
            const exists = await this.momentService.slugExists(String(slug), Number(excludedId))
            res.json({ isAvailable: !exists })
        } catch (err) {
            logger.error({ err }, '[MomentController] check slug error')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * Server-Sent Events endpoint: streams moment generation to the client.
     * @param {Request} req
     * @param {Response} res
     */
    public capture = (req: Request, res: Response): void => {
        const user: User = res.locals.user
        const { prompt } = req.body

        // start the worker, detached
        this.streamWorker.capture(user.id, prompt)

        // subscribe to events
        this.setupStreamListeners(req, res, user.id)
    }

    /**
     * Server-Sent Events endpoint: resumes a stream for the current user.
     * @param {Request} req
     * @param {Response} res
     */
    public resume = (req: Request, res: Response): void => {
        const user: User = res.locals.user

        // no generation in progress for this user
        if (!this.streamWorker.isGenerating(user.id)) {
            this.sendSseEvent(res, 'idle', {})
            res.end()
            return
        }

        // setup live listeners and replay history
        this.setupStreamListeners(req, res, user.id, { replayBuffer: true })
    }

    /**
     * Server-Sent Events endpoint: streams a targeted patch of an existing moment.
     * @param {Request} req
     * @param {Response} res
     */
    public patch = async (req: Request, res: Response): Promise<void> => {
        const user: User = res.locals.user
        const { id } = req.params
        const { nodeId, prompt, content } = req.body

        // load prior change prompts (from oldest to newest)
        let history: string[]
        try {
            const changes = await this.changeService.getAll(Number(id))
            history = changes.map(change => change.prompt)
        } catch (err) {
            logger.error({ err }, '[MomentController] patch: failed to load change history')
            res.status(500).json({ error: 'Internal server error.' })
            return
        }

        this.streamWorker.patch(user.id, { prompt, content, nodeId, history })

        this.setupStreamListeners(req, res, user.id, {
            onDone: async (data: { momentContent: MomentContent }) => {
                return this.changeService.store({
                    moment_id: Number(id),
                    node_id: nodeId,
                    prompt,
                    old_content: content,
                    new_content: data.momentContent,
                })
            },
            onDoneErrorMessage: 'Failed to save the patched Moment.',
            onDoneErrorLogMessage: 'patch update error',
        })
    }

    /**
     * Core helper to manage event subscription, chunk playback, and connection cleanup.
     * @param {Request} req
     * @param {Response} res
     * @param {number} userId
     * @param options
     */
    private setupStreamListeners(
        req: Request,
        res: Response,
        userId: number,
        options: {
            replayBuffer?: boolean
            onDone?: (data: { prompt: string; momentContent: MomentContent }) => Promise<unknown>
            onDoneErrorMessage?: string
            onDoneErrorLogMessage?: string
        } = {}
    ): void {
        const emitter = this.streamWorker.getEmitter(userId)!

        const onChunk = (data: { chunk: string }) => {
            this.sendSseEvent(res, 'chunk', data)
        }
        const onDone = async (data: { prompt: string, momentContent: MomentContent }) => {
            if (options.onDone) {
                try {
                    const result = await options.onDone(data)
                    this.sendSseEvent(res, 'done', result)
                } catch (err) {
                    logger.error({ err }, options.onDoneErrorLogMessage ?? 'done error')
                    this.sendSseEvent(res, 'error', { error: options.onDoneErrorMessage ?? 'Failed to save the Moment.' })
                } finally {
                    res.end()
                }
                return
            }

            if (options.replayBuffer) {
                // the capture connection is responsible for persisting the moment
                try {
                    const stored = await this.momentService.pollMomentBySlug(data.momentContent.slug)
                    this.sendSseEvent(res, 'done', stored)
                } catch (err) {
                    logger.error({ err }, '[MomentController] resume: moment not found after polling')
                    this.sendSseEvent(res, 'error', { error: 'Failed to retrieve the saved Moment.' })
                } finally {
                    res.end()
                }
                return
            }

            try {
                const stored = await this.momentService.store({
                    user_id: userId,
                    slug: data.momentContent.slug,
                    prompt: data.prompt,
                    content: data.momentContent,
                })
                this.sendSseEvent(res, 'done', stored)
            } catch (err) {
                logger.error({ err }, '[MomentController] store moment error')
                this.sendSseEvent(res, 'error', { error: 'Failed to save the Moment.' })
            } finally {
                res.end()
            }
        }
        const onError = (data: { error: string }) => {
            this.sendSseEvent(res, 'error', data)
            res.end()
        }

        // subscribe to live events
        emitter.on('chunk', onChunk)
        emitter.once('done', onDone)
        emitter.once('error', onError)

        // if it's a resume, replay chunks
        if (options.replayBuffer) {
            for (const event of this.streamWorker.getBufferedEvents(userId)) {
                this.sendSseEvent(res, event.event, event.data)
            }
        }

        // handle disconnection
        req.once('close', () => {
            emitter.off('chunk', onChunk)
            emitter.off('done', onDone)
            emitter.off('error', onError)
        })
    }

    /**
     * Formats and writes data conforming to the official EventStream specification.
     * @param {Response} res
     * @param {string} event
     * @param {unknown} data
     */
    private sendSseEvent(res: Response, event: string, data: unknown): void {
        res.write(`event: ${event}\n`)
        res.write(`data: ${JSON.stringify(data)}\n\n`)
    }
}
