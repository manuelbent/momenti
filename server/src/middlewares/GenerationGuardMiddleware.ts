import { Request, Response, NextFunction } from 'express'
import logger from '../config/logger'
import User from '../models/User'
import RedisService from '../services/RedisService'

/**
 * Rejects the request with 409 if a generation is already
 * in progress for the current user.
 * Must run after InviteKeyMiddleware (requires res.locals.user)
 * and before SseMiddleware (headers must not yet be flushed).
 * @class GenerationGuardMiddleware
 */
export default class GenerationGuardMiddleware {
    /**
     * @constructor
     * @param {RedisService} redisService
     */
    constructor(private redisService: RedisService) {}

    /**
     * @param {Request} _
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(_: Request, res: Response, next: NextFunction): Promise<void> {
        const user: User = res.locals.user

        let generationId: string|null
        try {
            generationId = await this.redisService.acquireGenerationLock(user.id)
        } catch (err) {
            logger.error({ err, userId: user.id }, '[GenerationGuardMiddleware] Failed to acquire generation lock')
            res.status(503).json({ error: 'Unable to start generation. Please try again.' })
            return
        }

        if (!generationId) {
            res.status(409).json({ error: 'A generation is already in progress.' })
            return
        }

        res.locals.generationId = generationId

        next()
    }
}
