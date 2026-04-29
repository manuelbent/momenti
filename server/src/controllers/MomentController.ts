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
     * @param {Request} req
     * @param {Response} res
     */
    public async capture(req: Request, res: Response): Promise<void> {
        try {
            const { prompt } = req.body
            const moment = await this.momentService.generate(prompt.trim())
            res.status(200).json(moment)
        } catch (err) {
            console.error('[MomentController] Error:', err)
            res.status(500).json({ error: 'Failed to generate the Moment. Please try again.' })
        }
    }
}
