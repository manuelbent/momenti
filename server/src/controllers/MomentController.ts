import { Request, Response } from 'express'
import MomentService from '../services/MomentService'

/**
 * @class MomentController
 */
export default class MomentController {
    /**
     * @constructor
     * @param {MomentService} momentService
     */
    constructor(private momentService: MomentService) {}

    /**
     * Server-Sent Events endpoint: streams moment generation to the client.
     * Events:
     *   - `chunk`  – partial text delta from the model
     *   - `done`   – final Moment JSON object
     *   - `error`  – error message string
     *
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
