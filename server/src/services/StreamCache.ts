import StreamCacheInterface from '../interfaces/StreamCacheInterface'

/**
 * Tracks active generations by userId until completion or the configured TTL.
 * @class StreamCache
 */
export default class StreamCache implements StreamCacheInterface {
    /**
     * The in-memory store.
     * @private
     */
    private store = new Map<number, ReturnType<typeof setTimeout>>()

    /**
     * @constructor
     * @param {number} ttlMs
     */
    constructor(private ttlMs: number = 10 * 60 * 1000) {}

    /**
     * Initializes a fresh cache entry for the given user.
     * @param {number} userId
     */
    public init(userId: number): void {
        this.clear(userId)
        const timer = setTimeout(() => this.store.delete(userId), this.ttlMs)
        this.store.set(userId, timer)
    }

    /**
     * Returns true if a generation is currently in progress for the given user.
     * @param {number} userId
     */
    public isGenerating(userId: number): boolean {
        return this.store.has(userId)
    }

    /**
     * Clears the cache entry entirely for the given user.
     * @param {number} userId
     */
    public clear(userId: number): void {
        const timer = this.store.get(userId)
        if (timer !== undefined) {
            clearTimeout(timer)
            this.store.delete(userId)
        }
    }
}
