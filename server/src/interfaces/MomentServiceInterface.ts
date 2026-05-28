import Moment from '../models/Moment'

/**
 * @interface MomentServiceInterface
 */
export default interface MomentServiceInterface {
    store(data: Partial<Moment>): Promise<Moment>
    update(id: number, data: Partial<Moment>): Promise<Moment>
    getBySlug(slug: string): Promise<Moment|null>
    getPublishedBySlug(slug: string): Promise<Moment|null>
    getAll(userId: number): Promise<Moment[]>
    slugExists(slug: string, excludeId?: number): Promise<boolean>
    pollMomentBySlug(slug: string, timeoutMs?: number): Promise<Moment>
}
