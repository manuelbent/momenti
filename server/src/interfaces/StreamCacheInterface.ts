/**
 * @interface StreamCacheInterface
 */
export default interface StreamCacheInterface {
    init(userId: number): void
    isGenerating(userId: number): boolean
    clear(userId: number): void
}
