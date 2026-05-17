import { EventEmitter } from 'events'

/**
 * @interface StreamWorkerInterface
 */
export default interface StreamWorkerInterface {
    /**
     * Starts a new generation stream for the given user.
     * Clears any existing entry for the user before beginning.
     * @param {number} userId
     * @param {string} prompt
     */
    start(userId: number, prompt: string): void

    /**
     * Returns the live EventEmitter for the given user's stream, if one exists.
     * Returns undefined if no stream has been started or it has already been cleaned up.
     * @param {number} userId
     */
    getEmitter(userId: number): EventEmitter | undefined
}

