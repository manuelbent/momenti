import { Request, Response, NextFunction } from 'express'
import StreamCacheServiceInterface from '../interfaces/StreamCacheServiceInterface'
import User from '../models/User'

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
     * @param {StreamCacheServiceInterface} streamCacheService
     */
    constructor(private streamCacheService: StreamCacheServiceInterface) {}

    /**
     * @param {Request} _
     * @param {Response} res
     * @param {NextFunction} next
     */
    public handle(_: Request, res: Response, next: NextFunction): void {
        const user: User = res.locals.user

        if (this.streamCacheService.isGenerating(user.id)) {
            res.status(409).json({ error: 'A generation is already in progress.' })
            return
        }

        next()
    }
}
