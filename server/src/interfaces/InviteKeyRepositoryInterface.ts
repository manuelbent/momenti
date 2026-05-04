import RepositoryInterface from './RepositoryInterface'
import InviteKey from '../models/InviteKey'

/**
 * @interface InviteKeyRepositoryInterface
 */
export default interface InviteKeyRepositoryInterface extends RepositoryInterface<InviteKey> {
    findByKey(key: string): Promise<InviteKey | null>
}

