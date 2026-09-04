import { Request, Response } from 'express'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import User from '../models/User'

/**
 * @class ResumeCaptureController
 */
export default class ResumeCaptureController {
    /**
     * @constructor
     * @param {StreamWorkerInterface} streamWorker
     */
    constructor(private streamWorker: StreamWorkerInterface) {}

    /**
     * Server-Sent Events endpoint: resumes a capture stream for the current user.
     * @param {Request} req
     * @param {Response} res
     */
    public handle(req: Request, res: Response): void {
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

        const emitter = this.streamWorker.getEmitter(user.id)!

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
