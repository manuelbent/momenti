import { Request, Response } from 'express'
import logger from '../config/logger'
import FeedbackServiceInterface from '../interfaces/FeedbackServiceInterface'
import User from '../models/User'
import { FeedbackType } from '../models/Feedback'

/**
 * @class FeedbackController
 */
export default class FeedbackController {
    /**
     * @constructor
     * @param {FeedbackServiceInterface} feedbackService
     */
    constructor(private feedbackService: FeedbackServiceInterface) {}

    /**
     * Store a new feedback entry.
     * @param {Request} req
     * @param {Response} res
     */
    public async store(req: Request, res: Response): Promise<void> {
        try {
            const user: User = res.locals.user
            const { type, message } = req.body as { type: FeedbackType; message: string }
            await this.feedbackService.store(user.id, type, message)
            res.status(201).send()
        } catch (err) {
            logger.error({ err }, '[FeedbackController] store error')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }
}

