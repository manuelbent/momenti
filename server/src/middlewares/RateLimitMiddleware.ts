import { rateLimit, Options } from 'express-rate-limit'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import SqliteRateLimitStore from '../stores/SqliteRateLimitStore'

/**
 * Thin wrapper around express-rate-limit that uses a shared SQLite store,
 * making it safe for multi-process PM2 deployments.
 * @class RateLimitMiddleware
 */
export default class RateLimitMiddleware {
    /**
     @private {RequestHandler}
     */
    private readonly handler: RequestHandler

    /**
     * @param {Partial<Options>} options
     * @constructor
     */
    constructor(options: Partial<Pick<Options, 'windowMs' | 'limit' | 'message'>> & { dbPath?: string } = {}) {
        this.handler = rateLimit({
            windowMs: options.windowMs ?? 15 * 60 * 1000,
            limit: options.limit ?? 20,
            message: options.message ?? { error: 'Too many requests. Please try again later.' },
            store: new SqliteRateLimitStore(options.dbPath),
            standardHeaders: 'draft-7',
            legacyHeaders: false,
        })
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @return {void}
     */
    public handle(req: Request, res: Response, next: NextFunction): void {
        this.handler(req, res, next)
    }
}
