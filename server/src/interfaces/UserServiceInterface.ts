import User from '../models/User'

/**
 * @interface UserServiceInterface
 */
export default interface UserServiceInterface {
    create(name: string, email: string): Promise<User>
    getByInviteKey(key: string): Promise<User | null>
}
