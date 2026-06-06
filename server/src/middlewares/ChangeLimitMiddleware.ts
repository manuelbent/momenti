import { Request, Response, NextFunction } from 'express'
import { MAX_CHANGES_ALLOWED } from '../config/constants'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'

/**
 * Middleware to check if the number of changes for a moment has reached the limit.
 * @class ChangeLimitMiddleware
 */
export default class ChangeLimitMiddleware {
    /**
     * @constructor
     */
    constructor(private momentService: MomentServiceInterface) {}

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { id } = req.params
        const moment = await this.momentService.getById(Number(id)) // this should be moved to the previous middleware
        if (!moment) {
            res.status(404).json({ error: 'Moment not found.' })
            return
        }

        const changes = await moment.getChanges()
        if (changes.length >= MAX_CHANGES_ALLOWED) {
            res.status(429).json({ error: `Change limit reached. You can make at most ${MAX_CHANGES_ALLOWED} changes to a moment.` })
            return
        }

        next()
    }
}
