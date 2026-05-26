import { Request, Response } from 'express'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import User from '../models/User'

/**
 * @class MomentController
 */
export default class MomentController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     * @param {StreamWorkerInterface} streamWorker
     */
    constructor(
        private momentService: MomentServiceInterface,
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
            console.error('[MomentController] load all moments error:', err)
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
            console.error('[MomentController] load moment by slug:', err)
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
            console.error('[MomentController] update error:', err)
            res.status(404).json({ error: 'Moment not found.' })
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
        this.streamWorker.start(user.id, prompt)

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
     * Core helper to manage event subscription, chunk playback, and connection cleanup.
     * @param {Request} req
     * @param {Response} res
     * @param {number} userId
     * @param {{replayBuffer: boolean, prompt: string}} options
     */
    private setupStreamListeners(
        req: Request,
        res: Response,
        userId: number,
        options: { replayBuffer?: boolean } = {}
    ): void {
        const emitter = this.streamWorker.getEmitter(userId)!

        const onChunk = (data: { chunk: string }) => {
            this.sendSseEvent(res, 'chunk', data)
        }
        const onDone = async (data: { prompt: string, momentContent: MomentContent }) => {
            try {
                const stored = await this.momentService.store({
                    user_id: userId,
                    slug: `${data.momentContent.meta.momentId}-${Date.now()}`,
                    prompt: data.prompt,
                    content: data.momentContent,
                })
                this.sendSseEvent(res, 'done', stored)
            } catch (err) {
                console.error('[MomentController] store moment error:', err)
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
