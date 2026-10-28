import { Request, Response, NextFunction } from 'express'
import StreamCacheInterface from '../interfaces/StreamCacheInterface'
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
     * @param {StreamCacheInterface} streamCache
     */
    constructor(private streamCache: StreamCacheInterface) {}

    /**
     * @param {Request} _
     * @param {Response} res
     * @param {NextFunction} next
     */
    public handle(_: Request, res: Response, next: NextFunction): void {
        const user: User = res.locals.user

        if (this.streamCache.isGenerating(user.id)) {
            res.status(409).json({ error: 'A generation is already in progress.' })
            return
        }

        next()
    }
}
