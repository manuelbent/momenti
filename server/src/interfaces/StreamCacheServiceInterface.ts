/**
 * @interface StreamCacheServiceInterface
 */
export default interface StreamCacheServiceInterface {
    /**
     * Appends a new event to the cache for the given invite key.
     * @param {number} userId
     * @param {StreamEvent} event
     */
    append(userId: number, event: StreamEvent): void

    /**
     * Returns all buffered events for the given invite key.
     * @param {number} userId
     */
    getAllEvents(userId: number): StreamEvent[]

    /**
     * Marks the stream for the given invite key as complete (done or error).
     * @param {number} userId
     */
    finalize(userId: number): void

    /**
     * Returns true if the stream for the given invite key has been finalized.
     * @param {number} userId
     */
    isComplete(userId: number): boolean

    /**
     * Returns true if any cache entry exists for the given invite key.
     * @param {number} userId
     */
    has(userId: number): boolean

    /**
     * Clears the cache entry for the given invite key.
     * @param {number} userId
     */
    clear(userId: number): void
}
