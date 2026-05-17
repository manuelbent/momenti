import { EventEmitter } from 'events'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import StreamCacheServiceInterface from '../interfaces/StreamCacheServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'

/**
 * Owns the OpenAI generation loop for a given user.
 * Emits typed stream events on a per-user EventEmitter and
 * mirrors every event into StreamCacheService.
 *
 * The controller subscribes to the emitter
 * instead of driving the loop themselves.
 *
 * Emitted events on each EventEmitter:
 *   'chunk': { chunk: string }
 *   'done': { slug: string, rawMoment: RawMoment }
 *   'error': { error: string }
 *
 * @class StreamWorker
 */
export default class StreamWorker implements StreamWorkerInterface {
    /**
     * Live emitters, one per active userId.
     * @private
     */
    private emitters = new Map<number, EventEmitter>()

    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     * @param {StreamCacheServiceInterface} streamCacheService
     */
    constructor(
        private momentService: MomentServiceInterface,
        private streamCacheService: StreamCacheServiceInterface,
    ) {}

    /** @inheritdoc */
    public start(userId: number, prompt: string): void {
        // discard any previous stream state for this user
        // if start is fired, it's a fresh new generation
        this.streamCacheService.clear(userId)
        this.emitters.delete(userId)

        const emitter = new EventEmitter()
        this.emitters.set(userId, emitter)

        // run the generation loop detached from the call stack
        this.run(userId, prompt, emitter).catch((err) => {
            console.error(`[StreamWorker] Unhandled error for userId ${userId}:`, err)
            this.emit(userId, emitter, 'error', { error: 'Unexpected error during generation.' })
            this.finalize(userId)
        })
    }

    /** @inheritdoc */
    public getEmitter(userId: number): EventEmitter | undefined {
        return this.emitters.get(userId)
    }

    /**
     * Runs the generation loop, emitting and caching events as they arrive.
     * @param {number} userId
     * @param {string} prompt
     * @param {EventEmitter} emitter
     * @private
     */
    private async run(userId: number, prompt: string, emitter: EventEmitter): Promise<void> {
        try {
            for await (const payload of this.momentService.generateStream(prompt)) {
                if (payload.error) {
                    this.emit(userId, emitter, 'error', { error: payload.error })
                    break
                }

                if (payload.done && payload.slug && payload.rawMoment) {
                    this.emit(userId, emitter, 'done', { slug: payload.slug, rawMoment: payload.rawMoment })
                    break
                }

                if (payload.chunk) {
                    this.emit(userId, emitter, 'chunk', { chunk: payload.chunk })
                }
            }
        } catch (err) {
            console.error(`[StreamWorker] Generation loop error for userId=${userId}:`, err)
            this.emit(userId, emitter, 'error', { error: 'Failed to generate the Moment. Please try again.' })
        } finally {
            this.finalize(userId)
        }
    }

    /**
     * Emits a named event on the emitter and appends it to the cache.
     * @param {number} userId
     * @param {EventEmitter} emitter
     * @param {'chunk' | 'done' | 'error'} event
     * @param {unknown} data
     * @private
     */
    private emit(userId: number, emitter: EventEmitter, event: StreamEvent['event'], data: unknown): void {
        emitter.emit(event, data)
        this.streamCacheService.append(userId, { event, data })
    }

    /**
     * Marks the stream as complete in the cache and removes the live emitter.
     * @param {number} userId
     * @private
     */
    private finalize(userId: number): void {
        this.streamCacheService.finalize(userId)
        this.emitters.delete(userId)
    }
}
