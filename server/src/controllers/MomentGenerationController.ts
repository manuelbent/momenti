import { Request, Response } from 'express'
import { EventEmitter } from 'node:events'
import { emit } from '../utils/sse'
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
        const options: CaptureMomentOptions = {
            heroImageUrl: res.locals.heroImageUrl,
        }

        emit(res, 'progress', { stage: 'generating-moment' })
        const emitter = this.streamWorker.capture(
            user.id,
            prompt,
            options,
            ({ prompt, momentContent }) => this.storeCapture(user.id, prompt, momentContent),
        )

        this.stream(res, emitter)
    }

    private async storeCapture(
        userId: number,
        prompt: string,
        momentContent: MomentContent,
    ): Promise<unknown> {
        return this.momentService.store({
            user_id: userId,
            slug: momentContent.slug,
            prompt,
            content: momentContent,
        })
    }

    /**
     * Server-Sent Events endpoint: resumes a capture stream for the current user.
     * @param {Request} req
     * @param {Response} res
     */
    public resume(req: Request, res: Response): void {
        const user: User = res.locals.user

        if (!this.streamWorker.hasCapture(user.id)) {
            emit(res, 'idle', {}, true)
            return
        }

        const events = this.streamWorker.getBufferedEvents(user.id)
        for (const event of events) {
            emit(res, event.event, event.data)
        }

        if (!this.streamWorker.isGenerating(user.id)) {
            res.end()
            return
        }

        this.stream(res, this.streamWorker.getEmitter(user.id)!)
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
            emit(res, 'error', { error: 'Internal server error.' }, true)
            return
        }

        const emitter = this.streamWorker.patch(
            user.id,
            { nodeId, prompt, content, history },
            async ({ momentContent }) => {
                return this.changeService.store({
                    moment_id: momentId,
                    node_id: nodeId,
                    prompt,
                    old_content: content,
                    new_content: momentContent,
                })
            },
        )

        this.stream(res, emitter)
    }

    private stream(res: Response, emitter: EventEmitter): void {
        const onChunk = (data: { chunk: string }) => {
            emit(res, 'chunk', data)
        }
        const onDone = (data: unknown) => {
            emit(res, 'done', data, true)
        }
        const onError = (data: { error: string }) => {
            emit(res, 'error', data, true)
        }

        emitter.on('chunk', onChunk)
        emitter.once('done', onDone)
        emitter.once('stream-error', onError)

        res.once('close', () => {
            emitter.off('chunk', onChunk)
            emitter.off('done', onDone)
            emitter.off('stream-error', onError)
        })
    }
}
