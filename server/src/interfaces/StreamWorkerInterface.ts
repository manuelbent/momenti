import { EventEmitter } from 'events'

/**
 * @interface StreamWorkerInterface
 */
export default interface StreamWorkerInterface {
    capture(userId: number, prompt: string): void
    patch(userId: number, params: PatchMomentParams): void
    getEmitter(userId: number): EventEmitter | undefined
    isGenerating(userId: number): boolean
    getBufferedEvents(userId: number): StreamEvent[]
}
