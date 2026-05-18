import { Request, Response } from 'express'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import Moment from '../models/Moment'
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
     * Check if a slug is available.
     * @param {Request} req
     * @param {Response} res
     */
    public async checkSlug(req: Request, res: Response) {
        try {
            const slug = String(req.query.slug)
            const excludeId = req.query.excludeId ? Number(req.query.excludeId) : undefined
            const exists = await this.momentService.slugExists(slug, excludeId)
            res.status(200).json({ isAvailable: !exists })
        } catch (err) {
            console.error('[MomentController] check slug error:', err)
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
     * chunk: partial text delta from the model
     * done: final Moment JSON object
     * error: error message string
     * @param {Request} req
     * @param {Response} res
     */
    public capture(req: Request, res: Response): void {
        const user: User = res.locals.user
        const { prompt } = req.body

        const send = (event: StreamEvent['event'], data: unknown) => {
            res.write(`{ "event": "${event}", "data": ${JSON.stringify(data)} }\n\n`)
        }

        // start the worker, detached
        this.streamWorker.start(user.id, prompt.trim())

        // the emitter exists right after start
        const emitter = this.streamWorker.getEmitter(user.id)!

        const onChunk = (data: { chunk: string }) => {
            send('chunk', data)
        }

        const onDone = (moment: Moment) => {
            send('done', moment)
            res.end()
        }

        const onError = (data: { error: string }) => {
            send('error', data)
            res.end()
        }

        emitter.on('chunk', onChunk)
        emitter.once('done', onDone)
        emitter.once('error', onError)

        // if the client disconnects mid-stream, stop forwarding but
        // let the worker keep running so the cache stays populated for a future resume
        req.once('close', () => {
            emitter.off('chunk', onChunk)
            emitter.off('done', onDone)
            emitter.off('error', onError)
        })
    }

    /**
     * Server-Sent Events endpoint: resumes a stream for the current user.
     * - No generation in progress: sends a single 'idle' event and closes.
     * - Generation in progress: subscribes to the live emitter, replays buffered
     *   chunks, then continues forwarding events as they arrive.
     * @param {Request} req
     * @param {Response} res
     */
    public resume(req: Request, res: Response): void {
        const user: User = res.locals.user

        const send = (event: string, data: unknown) => {
            res.write(`{ "event": "${event}", "data": ${JSON.stringify(data)} }\n\n`)
        }

        // no generation in progress for this user
        if (!this.streamWorker.isGenerating(user.id)) {
            send('idle', {})
            res.end()
            return
        }

        // stream in progress: subscribe first, then replay buffered chunks
        const emitter = this.streamWorker.getEmitter(user.id)!

        const onChunk = (data: { chunk: string }) => send('chunk', data)
        const onDone = (moment: Moment) => { send('done', moment); res.end() }
        const onError = (data: { error: string }) => { send('error', data); res.end() }

        emitter.on('chunk', onChunk)
        emitter.once('done', onDone)
        emitter.once('error', onError)

        for (const event of this.streamWorker.getBufferedEvents(user.id)) {
            send(event.event, event.data)
        }

        req.once('close', () => {
            emitter.off('chunk', onChunk)
            emitter.off('done', onDone)
            emitter.off('error', onError)
        })
    }
}
