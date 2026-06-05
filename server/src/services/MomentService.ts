import Moment from '../models/Moment'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'

/**
 * @class MomentService
 */
export default class MomentService implements MomentServiceInterface {
    /**
     * @constructor
     */
    constructor(private momentRepository: MomentRepositoryInterface) {}

    /**
     * Persist moment to DB.
     * @param {Partial<Moment>} data
     */
    public async store(data: Partial<Moment>): Promise<Moment> {
        return this.momentRepository.create(data)
    }

    /**
     * Update an existing moment by id.
     * @param {number} id
     * @param {Partial<Moment>} data
     */
    public async update(id: number, data: Partial<Moment>): Promise<Moment> {
        await this.momentRepository.update(id, data)
        const moment = await this.momentRepository.findById(id)

        if (!moment) {
            throw new Error(`Moment ${id} not found after update`)
        }

        return moment
    }

    /**
     * Find a moment by its slug.
     * @param {string} slug
     */
    public async getBySlug(slug: string): Promise<Moment|null> {
        return this.momentRepository.findBy('slug', slug)
    }

    /**
     * Find a published moment by its slug.
     * @param {string} slug
     * @return {Moment|null}
     */
    public async getPublishedBySlug(slug: string): Promise<Moment|null> {
        return await this.momentRepository.findPublishedBySlug(slug)
    }

    /**
     * Get all moments by user id.
     * @param {number} userId
     */
    public async getAll(userId: number): Promise<Moment[]> {
        return this.momentRepository.findManyBy('user_id', userId)
    }

    /**
     * Check if a slug already exists in the database.
     * @param {string} slug
     * @param {number} excludeId - Optional moment id to exclude from the check (useful on updates).
     */
    public async slugExists(slug: string, excludeId?: number): Promise<boolean> {
        const moment = await this.momentRepository.findBy('slug', slug)
        if (!moment) {
            return false
        }

        if (excludeId !== undefined) {
            return moment.id !== excludeId
        }

        return true
    }

    /**
     * Poll for a moment by slug, retrying every 200ms up to 20 times.
     * @throws {Error} If the moment is not found after polling.
     * @param {string} slug
     * @return {Promise<Moment>}
     */
    public async pollMomentBySlug(slug: string): Promise<Moment> {
        for (let i = 0; i < 20; i++) {
            const moment = await this.getBySlug(slug)
            if (moment) {
                return moment
            }

            await new Promise(resolve => setTimeout(resolve, 200))
        }
        throw new Error(`Moment with slug ${slug} not found after polling`)
    }
}
