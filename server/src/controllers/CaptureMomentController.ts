import { Request, Response } from 'express'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import User from '../models/User'

/**
 * @class CaptureMomentController
 */
export default class CaptureMomentController {
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
     * Server-Sent Events endpoint: streams moment generation to the client.
     * @param {Request} req
     * @param {Response} res
     */
    public handle(req: Request, res: Response): void {
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
