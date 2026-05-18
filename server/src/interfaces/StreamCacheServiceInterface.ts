/**
 * @interface StreamCacheServiceInterface
 */
export default interface StreamCacheServiceInterface {
    init(userId: number): void
    isGenerating(userId: number): boolean
    append(userId: number, event: StreamEvent): void
    getAllEvents(userId: number): StreamEvent[]
    clear(userId: number): void
}
