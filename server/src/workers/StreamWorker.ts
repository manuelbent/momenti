import { EventEmitter } from 'events'
import logger from '../config/logger'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import StreamCacheInterface from '../interfaces/StreamCacheInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'

/**
 * @class StreamWorker
 */
export default class StreamWorker implements StreamWorkerInterface {
    /**
     * @constructor
     * @param {LLMServiceInterface} llmService
     * @param {StreamCacheInterface} streamCache
     */
    constructor(
        private llmService: LLMServiceInterface,
        private streamCache: StreamCacheInterface,
    ) {}

    /**
     * Starts a new capture stream for the given user.
     * @param {number} userId
     * @param {string} prompt
     * @param {CaptureMomentOptions} options
     * @param onDone
     */
    public capture(
        userId: number,
        prompt: string,
        options: CaptureMomentOptions,
        onDone: (data: { prompt: string; momentContent: MomentContent }) => Promise<unknown>,
    ): EventEmitter {
        this.streamCache.init(userId)
        const emitter = new EventEmitter()

        void this.runCapture(userId, prompt, options, emitter, onDone)
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
        this.streamCache.init(userId)
        const emitter = new EventEmitter()

        void this.runPatch(userId, params, emitter, onDone)
        return emitter
    }

    /**
     * Runs capture and stores the completed Moment through the controller callback.
     * @param {number} userId
     * @param {string} prompt
     * @param {CaptureMomentOptions} options
     * @param {EventEmitter} emitter
     * @param onDone
     * @private
     */
    private async runCapture(
        userId: number,
        prompt: string,
        options: CaptureMomentOptions,
        emitter: EventEmitter,
        onDone: (data: { prompt: string; momentContent: MomentContent }) => Promise<unknown>,
    ): Promise<void> {
        try {
            for await (const payload of this.llmService.captureMoment(prompt, options)) {
                if ('error' in payload) {
                    emitter.emit('stream-error', { error: payload.error })
                    break
                }

                if ('chunk' in payload) {
                    emitter.emit('chunk', { chunk: payload.chunk })
                }

                if ('done' in payload) {
                    try {
                        const moment = await onDone({ prompt, momentContent: payload.momentContent })
                        emitter.emit('done', moment)
                    } catch (err) {
                        logger.error({ err, userId }, '[StreamWorker] Store moment error')
                        emitter.emit('stream-error', { error: 'Failed to save the Moment.' })
                    }
                    break
                }
            }
        } catch (err) {
            logger.error({ err, userId }, '[StreamWorker] Generation loop error')
            emitter.emit('stream-error', { error: 'Failed to generate the Moment. Please try again.' })
        } finally {
            this.streamCache.clear(userId)
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
            this.streamCache.clear(userId)
        }
    }
}
