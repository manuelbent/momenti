import { EventEmitter } from 'events'

/**
 * @interface StreamWorkerInterface
 */
export default interface StreamWorkerInterface {
    capture(
        userId: number,
        prompt: string,
        options: CaptureMomentOptions,
        onDone: (data: { prompt: string; momentContent: MomentContent }) => Promise<unknown>,
    ): EventEmitter
    patch(
        userId: number,
        params: PatchMomentParams,
        onDone: (data: { momentContent: MomentContent }) => Promise<unknown>,
    ): EventEmitter
}
