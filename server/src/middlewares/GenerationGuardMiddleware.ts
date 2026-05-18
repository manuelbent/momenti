import { Request, Response, NextFunction } from 'express'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
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
     * @param {StreamWorkerInterface} streamWorker
     */
    constructor(private streamWorker: StreamWorkerInterface) {}

    /**
     * @param {Request} _
     * @param {Response} res
     * @param {NextFunction} next
     */
    public handle(_: Request, res: Response, next: NextFunction): void {
        const user: User = res.locals.user

        if (this.streamWorker.isGenerating(user.id)) {
            res.status(409).json({ error: 'A generation is already in progress.' })
            return
        }

        next()
    }
}

