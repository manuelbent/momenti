import { EventEmitter } from 'events'

/**
 * @interface StreamWorkerInterface
 */
export default interface StreamWorkerInterface {
    start(userId: number, prompt: string): void
    getEmitter(userId: number): EventEmitter | undefined
    isGenerating(userId: number): boolean
    getBufferedEvents(userId: number): StreamEvent[]
}
