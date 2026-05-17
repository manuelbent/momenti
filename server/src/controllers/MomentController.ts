import { Request, Response } from 'express'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import User from '../models/User'

/**
 * @class MomentController
 */
export default class MomentController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     */
    constructor(private momentService: MomentServiceInterface) {}

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
    public async capture(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user

        const { prompt } = req.body

        const send = (event: 'chunk'|'done'|'error', data: unknown) => {
            res.write(`{ "event": "${event}", "data": ${JSON.stringify(data)} }\n\n`)
        }

        try {
            for await (const payload of this.momentService.generateStream(prompt.trim())) {
                if (payload.error) {
                    send('error', { error: payload.error })
                    return
                }

                if (payload.done && payload.rawMoment && payload.slug) {
                    const moment = await this.momentService.store({
                        user_id: user.id,
                        slug: payload.slug,
                        prompt,
                        content: payload.rawMoment
                    })
                    send('done', moment)
                    return
                }

                if (payload.chunk) {
                    send('chunk', { chunk: payload.chunk })
                }
            }
        } catch (err) {
            console.error('[MomentController] SSE Error:', err)
            send('error', { error: 'Failed to generate the Moment. Please try again.' })
        } finally {
            res.end()
        }
    }
}
