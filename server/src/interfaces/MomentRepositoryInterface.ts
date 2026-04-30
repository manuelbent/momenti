import RepositoryInterface from './RepositoryInterface'
import Moment from '../models/Moment'

/**
 * @interface MomentRepositoryInterface
 */
export default interface MomentRepositoryInterface extends RepositoryInterface<Moment> {
    findAll(): Promise<Moment[]>
}
