import RepositoryInterface from './RepositoryInterface'
import User from '../models/User'

/**
 * @interface UserRepositoryInterface
 */
export default interface UserRepositoryInterface extends RepositoryInterface<User> {
    findByInviteKey(key: string): Promise<User | null>
}
