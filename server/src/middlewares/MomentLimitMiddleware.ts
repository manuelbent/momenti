import { Request, Response, NextFunction } from 'express'
import { MAX_MOMENTS_ALLOWED } from '../config/constants'
import User from '../models/User'

/**
 * Ensures that the invite key owner has not exceeded the maximum number of moments.
 * Relies on InviteKeyMiddleware having already resolved res.locals.user.
 * @class MomentLimitMiddleware
 */
export default class MomentLimitMiddleware {
    /**
     * @constructor
     */
    constructor() {}

    /**
     * Rejects the request with 429 if the invite key owner already has 10 or more moments.
     * @param {Request} _
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(_: Request, res: Response, next: NextFunction): Promise<void> {
        const user: User = res.locals.user
        const moments = await user.getMoments()
        if (moments.length >= MAX_MOMENTS_ALLOWED) {
            res.status(429).json({ error: `Limit reached. You can generate at most ${MAX_MOMENTS_ALLOWED} moments.` })
            return
        }

        next()
    }
}
