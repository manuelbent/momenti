import RepositoryInterface from './RepositoryInterface'
import Change from '../models/Change'

/**
 * @interface ChangeRepositoryInterface
 */
export default interface ChangeRepositoryInterface extends RepositoryInterface<Change> {
    getAllByMomentId(momentId: number): Promise<Change[]>
}
