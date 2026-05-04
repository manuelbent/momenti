import { Request, Response } from 'express'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'

/**
 * @class MomentController
 */
export default class MomentController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     */
    constructor(private momentService: MomentServiceInterface) {}

    // temp
    public async findAll(_: Request, res: Response) {
        const moments = await this.momentService.getAll()
        res.send(moments)
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
            res.json({ available: !exists })
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
        const { prompt } = req.body

        const send = (event: string, data: unknown) => {
            res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
        }

        try {
            for await (const payload of this.momentService.generateStream(prompt.trim())) {
                if (payload.error) {
                    send('error', { error: payload.error })
                    return
                }

                if (payload.done && payload.moment) {
                    send('done', payload.moment)
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
