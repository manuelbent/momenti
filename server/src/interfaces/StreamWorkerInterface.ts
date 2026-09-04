import { EventEmitter } from 'events'

/**
 * @interface StreamWorkerInterface
 */
export default interface StreamWorkerInterface {
    capture(
        userId: number,
        prompt: string,
        onDone: (data: { prompt: string; momentContent: MomentContent }) => Promise<unknown>,
    ): EventEmitter
    patch(
        userId: number,
        params: PatchMomentParams,
        onDone: (data: { momentContent: MomentContent }) => Promise<unknown>,
    ): EventEmitter
    getEmitter(userId: number): EventEmitter | undefined
    isGenerating(userId: number): boolean
    hasCapture(userId: number): boolean
    getBufferedEvents(userId: number): StreamEvent[]
}
