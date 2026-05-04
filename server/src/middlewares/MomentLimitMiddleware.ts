import { Request, Response, NextFunction } from 'express'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import InviteKey from '../models/InviteKey'
import { MAX_MOMENTS_ALLOWED } from '../config/constants'


/**
 * Ensures that the invite key owner has not exceeded the maximum number of moments.
 * Relies on InviteKeyMiddleware having already resolved res.locals.inviteKey.
 * @class MomentLimitMiddleware
 */
export default class MomentLimitMiddleware {
    /**
     * @constructor
     * @param {MomentRepositoryInterface} momentRepository
     */
    constructor(private readonly momentRepository: MomentRepositoryInterface) {}

    /**
     * Rejects the request with 429 if the invite key owner already has 10 or more moments.
     * @param {Request} _
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(_: Request, res: Response, next: NextFunction): Promise<void> {
        const inviteKey: InviteKey = res.locals.inviteKey
        const moments = await this.momentRepository.findManyBy('user_id', inviteKey.user_id)
        if (moments.length >= MAX_MOMENTS_ALLOWED) {
            res.status(429).json({ error: `Moments limit reached. You can generate at most ${MAX_MOMENTS_ALLOWED} moments.` })
            return
        }

        next()
    }
}

