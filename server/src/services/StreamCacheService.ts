import StreamCacheServiceInterface from '../interfaces/StreamCacheServiceInterface'

/**
 * Internal structure for a single cache entry.
 * Its presence in the store means a generation is in progress.
 */
interface CacheEntry {
    type: StreamType
    events: StreamEvent[]
    isGenerating: boolean
    timer: ReturnType<typeof setTimeout>
}

/**
 * In-memory cache for SSE stream events, keyed by userId.
 * Completed capture entries are retained until the configured TTL
 * so a disconnected client can replay the terminal event.
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
     * @param {StreamType} type
     */
    public init(userId: number, type: StreamType): void {
        this.clear(userId)
        const timer = setTimeout(() => this.store.delete(userId), this.ttlMs)
        this.store.set(userId, { type, events: [], isGenerating: true, timer })
    }

    /**
     * Returns true if a generation is currently in progress for the given user.
     * @param {number} userId
     */
    public isGenerating(userId: number): boolean {
        return this.store.get(userId)?.isGenerating ?? false
    }

    /**
     * Checks whether the cached stream has the requested type.
     * @param {number} userId
     * @param {StreamType} type
     */
    public hasStream(userId: number, type: StreamType): boolean {
        return this.store.get(userId)?.type === type
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
     * Marks a stream as completed while retaining its buffered events.
     * @param {number} userId
     */
    public complete(userId: number): void {
        const entry = this.store.get(userId)
        if (entry) {
            entry.isGenerating = false
        }
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
