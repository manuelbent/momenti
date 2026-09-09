import { Request, Response } from 'express'
import { EventEmitter } from 'node:events'
import logger from '../config/logger'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import User from '../models/User'

/**
 * @class MomentGenerationController
 */
export default class MomentGenerationController {
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
     * Server-Sent Events endpoint: streams moment generation to the client.
     * @param {Request} req
     * @param {Response} res
     */
    public capture(req: Request, res: Response): void {
        const user: User = res.locals.user
        const { prompt } = req.body

        const emitter = this.streamWorker.capture(
            user.id,
            prompt,
            async data => {
                return this.momentService.store({
                    user_id: user.id,
                    slug: data.momentContent.slug,
                    prompt: data.prompt,
                    content: data.momentContent,
                })
            },
        )

        this.stream(req, res, emitter)
    }

    /**
     * Server-Sent Events endpoint: resumes a capture stream for the current user.
     * @param {Request} req
     * @param {Response} res
     */
    public resume(req: Request, res: Response): void {
        const user: User = res.locals.user

        if (!this.streamWorker.hasCapture(user.id)) {
            res.write('event: idle\n')
            res.write('data: {}\n\n')
            res.end()
            return
        }

        const events = this.streamWorker.getBufferedEvents(user.id)
        for (const event of events) {
            res.write(`event: ${event.event}\n`)
            res.write(`data: ${JSON.stringify(event.data)}\n\n`)
        }

        if (!this.streamWorker.isGenerating(user.id)) {
            res.end()
            return
        }

        this.stream(req, res, this.streamWorker.getEmitter(user.id)!)
    }

    /**
     * Server-Sent Events endpoint: streams a targeted patch of an existing moment.
     * @param {Request} req
     * @param {Response} res
     */
    public async patch(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user
        const momentId = Number(req.params.id)
        const { nodeId, prompt, content } = req.body

        let history: string[]
        try {
            const changes = await this.changeService.getAll(momentId)
            history = changes.map(change => change.prompt)
        } catch (err) {
            logger.error({ err }, '[MomentGenerationController] Failed to load change history')
            res.status(500).json({ error: 'Internal server error.' })
            return
        }

        const emitter = this.streamWorker.patch(
            user.id,
            { nodeId, prompt, content, history },
            async data => {
                return this.changeService.store({
                    moment_id: momentId,
                    node_id: nodeId,
                    prompt,
                    old_content: content,
                    new_content: data.momentContent,
                })
            },
        )

        this.stream(req, res, emitter)
    }

    private stream(req: Request, res: Response, emitter: EventEmitter): void {
        const onChunk = (data: { chunk: string }) => {
            res.write('event: chunk\n')
            res.write(`data: ${JSON.stringify(data)}\n\n`)
        }
        const onDone = (data: unknown) => {
            res.write('event: done\n')
            res.write(`data: ${JSON.stringify(data)}\n\n`)
            res.end()
        }
        const onError = (data: { error: string }) => {
            res.write('event: error\n')
            res.write(`data: ${JSON.stringify(data)}\n\n`)
            res.end()
        }

        emitter.on('chunk', onChunk)
        emitter.once('done', onDone)
        emitter.once('stream-error', onError)

        req.once('close', () => {
            emitter.off('chunk', onChunk)
            emitter.off('done', onDone)
            emitter.off('stream-error', onError)
        })
    }
}
