import { randomUUID } from 'node:crypto'
import Redis from 'ioredis'
import redis from '../config/redis'
import logger from '../config/logger'

/**
 * Manages generation reservations and cached stream events.
 * @class RedisService
 */
export default class RedisService {
    /**
     * @private {Redis}
     */
    private readonly redis: Redis

    /**
     @private {number}
     */
    private readonly ttlMs: number

    /**
     * @constructor
     */
    constructor() {
        this.redis = redis
        this.ttlMs = 10 * 60 * 1000
    }

    /**
     * Atomically reserves the user and returns the owning generation ID.
     * @param {number} userId
     */
    public async acquireGenerationLock(userId: number): Promise<string | null> {
        const generationId = randomUUID()
        const acquired = await this.redis.set(
            `generation:active:${userId}`,
            generationId,
            'PX',
            this.ttlMs,
            'NX',
        )
        return acquired === 'OK' ? generationId : null
    }


    /**
     * Appends a generation event to its Redis Stream and refreshes its expiry.
     * Returns the Stream ID for use as the corresponding SSE event ID, or null
     * when caching fails.
     * @param {number} userId
     * @param {string} generationId
     * @param {string} event
     * @param {unknown} data
     */
    public async cacheGenerationEvent(
        userId: number,
        generationId: string,
        event: string,
        data: unknown,
    ): Promise<string | null> {
        try {
            const eventId = await this.redis.eval(
                `local eventId = redis.call('XADD', KEYS[1], '*', 'event', ARGV[1], 'data', ARGV[2])
                redis.call('PEXPIRE', KEYS[1], ARGV[3])
                return eventId`,
                1,
                `generation:events:${userId}:${generationId}`,
                event,
                JSON.stringify(data),
                this.ttlMs,
            )
            return String(eventId)
        } catch (err) {
            logger.warn({ err, userId, generationId, event }, '[RedisService] Failed to cache generation event')
            return null
        }
    }

    /**
     * Releases a reservation only if it still belongs to this generation.
     * @param {number} userId
     * @param {string} generationId
     */
    public async releaseGenerationLock(userId: number, generationId: string): Promise<void> {
        try {
            await this.redis.eval(
                `if redis.call('GET', KEYS[1]) == ARGV[1] then
                    return redis.call('DEL', KEYS[1])
                end
                return 0`,
                1,
                `generation:active:${userId}`,
                generationId,
            )
        } catch (err) {
            logger.error({ err, userId, generationId }, '[RedisService] Failed to release generation lock')
        }
    }
}
