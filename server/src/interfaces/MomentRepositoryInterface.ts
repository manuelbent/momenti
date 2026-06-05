import RepositoryInterface from './RepositoryInterface'
import Moment from '../models/Moment'

/**
 * @interface MomentRepositoryInterface
 */
export default interface MomentRepositoryInterface extends RepositoryInterface<Moment> {
    findManyBy(field: string, value: unknown): Promise<Moment[]>
    findPublishedBySlug(slug: string): Promise<Moment|null>
}
