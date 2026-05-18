import StreamCacheServiceInterface from '../interfaces/StreamCacheServiceInterface'

/**
 * Internal structure for a single cache entry.
 * Its presence in the store means a generation is in progress.
 */
interface CacheEntry {
    events: StreamEvent[]
    timer: ReturnType<typeof setTimeout>
}

/**
 * In-memory cache for SSE stream events, keyed by userId.
 * An entry exists only while generation is in progress.
 * Each entry is automatically evicted after the configured TTL
 * as a safety net against entries that never resolve.
 * @class StreamCacheService
 */
export default class StreamCacheService implements StreamCacheServiceInterface {
    /**
     * The in-memory store.
     * @private
     */
    private store = new Map<number, CacheEntry>()

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
        const timer = setTimeout(() => this.store.delete(userId), this.ttlMs)
        this.store.set(userId, { events: [], timer })
    }

    /**
     * Returns true if a generation is currently in progress for the given user.
     * @param {number} userId
     */
    public isGenerating(userId: number): boolean {
        return this.store.has(userId)
    }

    /**
     * Appends a new event to the buffer for the given user.
     * @param {number} userId
     * @param {StreamEvent} event
     */
    public append(userId: number, event: StreamEvent): void {
        this.store.get(userId)?.events.push(event)
    }

    /**
     * Returns all buffered events for the given user.
     * @param {number} userId
     */
    public getAllEvents(userId: number): StreamEvent[] {
        return this.store.get(userId)?.events ?? []
    }

    /**
     * Clears the cache entry entirely for the given user.
     * @param {number} userId
     */
    public clear(userId: number): void {
        const entry = this.store.get(userId)
        if (entry) {
            clearTimeout(entry.timer)
            this.store.delete(userId)
        }
    }
}
