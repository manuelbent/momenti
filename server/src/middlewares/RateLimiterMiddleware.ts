import { NextFunction, Request, Response } from 'express'
import { RateLimiterRedis, RateLimiterRes } from 'rate-limiter-flexible'
import redis from '../config/redis'
import logger from '../config/logger'

/**
 * IP-based sliding-window rate limiter backed by Redis.
 * Fails open: if Redis is unavailable the request is allowed through.
 * @class RateLimiterMiddleware
 */
export default class RateLimiterMiddleware {
    /**
     * @param {RateLimiterRedis}
     * @private
     */
    private readonly limiter: RateLimiterRedis

    /**
     * @constructor
     */
    constructor(limiter?: RateLimiterRedis) {
        this.limiter = limiter ?? new RateLimiterRedis({
            storeClient: redis,
            keyPrefix: 'rl:invite-keys:validate',
            points: Number(process.env.RATE_LIMIT_VALIDATE_MAX ?? 10),
            duration: Number(process.env.RATE_LIMIT_VALIDATE_WINDOW_SEC ?? 60),
            insuranceLimiter: undefined,
        })
    }

    /**
     * Express middleware. Keys by req.ip.
     * Returns 429 with Retry-After header when the limit is exceeded.
     * Fails open on Redis errors so a Redis outage never blocks the endpoint.
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @return Promise<void>
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const key = req.ip ?? 'unknown'

        try {
            await this.limiter.consume(key)
            next()
        } catch (err) {
            if (err instanceof RateLimiterRes) {
                const retryAfter = Math.ceil(err.msBeforeNext / 1000)
                res.setHeader('Retry-After', retryAfter)
                res.status(429).json({
                    error: 'Too many requests. Please try again later.',
                    retryAfter,
                })
                return
            }

            // redis unavailable, continue
            logger.error({ err }, '[RateLimiterMiddleware] Redis error, failing open')
            next()
        }
    }
}

