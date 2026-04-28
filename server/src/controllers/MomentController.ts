import { Request, Response } from 'express'
import MomentService from '../services/MomentService'

/**
 * @class MomentController
 */
class MomentController {
    private momentService: MomentService

    /**
     * @constructor
     */
    constructor() {
        this.momentService = new MomentService()
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    public async generate(req: Request, res: Response): Promise<void> {
        const { prompt } = req.body

        try {
            const moment = await this.momentService.generate(prompt.trim())
            res.status(200).json(moment)
        } catch (err) {
            console.error('[MomentController] Error:', err)
            res.status(500).json({ error: 'Failed to generate the Moment. Please try again.' })
        }
    }
}

export default new MomentController()
