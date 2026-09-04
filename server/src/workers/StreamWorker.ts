import { EventEmitter } from 'events'
import logger from '../config/logger'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import StreamCacheServiceInterface from '../interfaces/StreamCacheServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'

/**
 * @class StreamWorker
 */
export default class StreamWorker implements StreamWorkerInterface {
    private emitters = new Map<number, EventEmitter>()

    /**
     * @constructor
     * @param {LLMServiceInterface} llmService
     * @param {StreamCacheServiceInterface} streamCacheService
     */
    constructor(
        private llmService: LLMServiceInterface,
        private streamCacheService: StreamCacheServiceInterface,
    ) {}

    /**
     * Starts a new capture stream for the given user.
     * @param {number} userId
     * @param {string} prompt
     * @param onDone
     */
    public capture(
        userId: number,
        prompt: string,
        onDone: (data: { prompt: string; momentContent: MomentContent }) => Promise<unknown>,
    ): EventEmitter {
        this.streamCacheService.clear(userId)
        this.emitters.delete(userId)

        this.streamCacheService.init(userId, 'capture')
        const emitter = new EventEmitter()
        this.emitters.set(userId, emitter)

        void this.runCapture(userId, prompt, emitter, onDone)
        return emitter
    }

    /**
     * Starts a new patch stream for the given user.
     * @param {number} userId
     * @param {PatchMomentParams} params
     * @param onDone
     */
    public patch(
        userId: number,
        params: PatchMomentParams,
        onDone: (data: { momentContent: MomentContent }) => Promise<unknown>,
    ): EventEmitter {
        this.streamCacheService.clear(userId)
        this.emitters.delete(userId)

        this.streamCacheService.init(userId, 'patch')
        const emitter = new EventEmitter()
        this.emitters.set(userId, emitter)

        void this.runPatch(userId, params, emitter, onDone)
        return emitter
    }

    /**
     * @param {number} userId
     */
    public getEmitter(userId: number): EventEmitter|undefined {
        return this.emitters.get(userId)
    }

    /**
     * @param {number} userId
     */
    public isGenerating(userId: number): boolean {
        return this.streamCacheService.isGenerating(userId)
    }

    /**
     * @param {number} userId
     */
    public hasCapture(userId: number): boolean {
        return this.streamCacheService.hasStream(userId, 'capture')
    }

    /**
     * @param {number} userId
     */
    public getBufferedEvents(userId: number): StreamEvent[] {
        return this.streamCacheService.getAllEvents(userId)
    }

    /**
     * Runs capture and stores the completed Moment through the controller callback.
     * @param {number} userId
     * @param {string} prompt
     * @param {EventEmitter} emitter
     * @param onDone
     * @private
     */
    private async runCapture(
        userId: number,
        prompt: string,
        emitter: EventEmitter,
        onDone: (data: { prompt: string; momentContent: MomentContent }) => Promise<unknown>,
    ): Promise<void> {
        try {
            for await (const payload of this.llmService.captureMoment(prompt)) {
                if ('error' in payload) {
                    this.emit(userId, emitter, 'error', { error: payload.error })
                    break
                }

                if ('chunk' in payload) {
                    this.emit(userId, emitter, 'chunk', { chunk: payload.chunk })
                }

                if ('done' in payload) {
                    try {
                        const moment = await onDone({ prompt, momentContent: payload.momentContent })
                        this.emit(userId, emitter, 'done', moment)
                    } catch (err) {
                        logger.error({ err, userId }, '[StreamWorker] Store moment error')
                        this.emit(userId, emitter, 'error', { error: 'Failed to save the Moment.' })
                    }
                    break
                }
            }
        } catch (err) {
            logger.error({ err, userId }, '[StreamWorker] Generation loop error')
            this.emit(userId, emitter, 'error', { error: 'Failed to generate the Moment. Please try again.' })
        } finally {
            this.streamCacheService.clear(userId)
            this.emitters.delete(userId)
        }
    }

    /**
     * Runs patch and stores the completed Change through the controller callback.
     * @param {number} userId
     * @param {PatchMomentParams} params
     * @param {EventEmitter} emitter
     * @param onDone
     * @private
     */
    private async runPatch(
        userId: number,
        params: PatchMomentParams,
        emitter: EventEmitter,
        onDone: (data: { momentContent: MomentContent }) => Promise<unknown>,
    ): Promise<void> {
        try {
            for await (const payload of this.llmService.patchMoment(params)) {
                if ('error' in payload) {
                    emitter.emit('stream-error', { error: payload.error })
                    break
                }

                if ('chunk' in payload) {
                    emitter.emit('chunk', { chunk: payload.chunk })
                }

                if ('done' in payload) {
                    try {
                        const change = await onDone({ momentContent: payload.momentContent })
                        emitter.emit('done', change)
                    } catch (err) {
                        logger.error({ err, userId }, '[StreamWorker] Patch update error')
                        emitter.emit('stream-error', { error: 'Failed to save the patched Moment.' })
                    }
                    break
                }
            }
        } catch (err) {
            logger.error({ err, userId }, '[StreamWorker] Patch loop error')
            emitter.emit('stream-error', { error: 'Failed to patch the Moment. Please try again.' })
        } finally {
            this.streamCacheService.clear(userId)
            this.emitters.delete(userId)
        }
    }

    /**
     * Emits a named event and appends it to the capture buffer.
     * @param {number} userId
     * @param {EventEmitter} emitter
     * @param {'chunk' | 'done' | 'error'} event
     * @param {unknown} data
     * @private
     */
    private emit(userId: number, emitter: EventEmitter, event: StreamEvent['event'], data: unknown): void {
        this.streamCacheService.append(userId, { event, data })
        emitter.emit(event === 'error' ? 'stream-error' : event, data)
    }
}
