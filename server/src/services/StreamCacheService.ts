import StreamCacheServiceInterface from '../interfaces/StreamCacheServiceInterface'

/**
 * Internal structure for a single cache entry.
 */
interface CacheEntry {
    events: StreamEvent[]
    complete: boolean
    timer: ReturnType<typeof setTimeout>
}

/**
 * @class StreamCacheService
 *
 * In-memory cache for SSE stream events, keyed by invite key.
 * Each entry is automatically evicted after the configured TTL.
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
     * Returns the existing cache entry for the given invite key,
     * or creates a fresh one with a TTL timer.
     * @param {number} userId
     * @private
     */
    private getOrCreate(userId: number): CacheEntry {
        const existing = this.store.get(userId)
        if (existing) {
            return existing
        }

        const timer = setTimeout(() => {
            this.store.delete(userId)
        }, this.ttlMs)

        const entry: CacheEntry = { events: [], complete: false, timer }
        this.store.set(userId, entry)
        return entry
    }

    /** @inheritdoc */
    public append(userId: number, event: StreamEvent): void {
        const entry = this.getOrCreate(userId)
        entry.events.push(event)
    }

    /** @inheritdoc */
    public getAllEvents(userId: number): StreamEvent[] {
        return this.store.get(userId)?.events ?? []
    }

    /** @inheritdoc */
    public finalize(userId: number): void {
        const entry = this.store.get(userId)
        if (entry) {
            entry.complete = true
        }
    }

    /** @inheritdoc */
    public isComplete(userId: number): boolean {
        return this.store.get(userId)?.complete ?? false
    }

    /** @inheritdoc */
    public has(userId: number): boolean {
        return this.store.has(userId)
    }

    /** @inheritdoc */
    public clear(userId: number): void {
        const entry = this.store.get(userId)
        if (entry) {
            clearTimeout(entry.timer)
            this.store.delete(userId)
        }
    }
}

