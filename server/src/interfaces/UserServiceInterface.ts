import User from '../models/User'

/**
 * @interface UserServiceInterface
 */
export default interface UserServiceInterface {
    getByInviteKey(key: string): Promise<User | null>
}

