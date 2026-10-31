import { RateLimiterRedis } from 'rate-limiter-flexible'
import redis from '../config/redis'
import RateLimiterMiddleware from './RateLimiterMiddleware'

/**
 * @class ImageUploadRateLimiterMiddleware
 */
export default class ImageUploadRateLimiterMiddleware extends RateLimiterMiddleware {
    /**
     * @constructor
     */
    constructor() {
        super(new RateLimiterRedis({
            storeClient: redis,
            keyPrefix: 'rl:images:create',
            points: 10,
            duration: 60,
        }))
    }
}
