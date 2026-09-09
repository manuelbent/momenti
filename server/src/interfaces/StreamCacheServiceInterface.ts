/**
 * @interface StreamCacheServiceInterface
 */
export default interface StreamCacheServiceInterface {
    init(userId: number, type: StreamType): void
    isGenerating(userId: number): boolean
    hasStream(userId: number, type: StreamType): boolean
    append(userId: number, event: StreamEvent): void
    getAllEvents(userId: number): StreamEvent[]
    complete(userId: number): void
    clear(userId: number): void
}
