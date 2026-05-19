import User from '../models/User'
import UserRepositoryInterface from '../interfaces/UserRepositoryInterface'
import UserServiceInterface from '../interfaces/UserServiceInterface'

/**
 * @class UserService
 */
export default class UserService implements UserServiceInterface {
    /**
     * @constructor
     * @param {UserRepositoryInterface} userRepository
     */
    constructor(private userRepository: UserRepositoryInterface) {}

    /**
     * Get a user by their invite key.
     * @param {string} key
     * @returns {Promise<User | null>}
     */
    /**
     * Create a new user.
     * @param {string} name
     * @param {string} email
     * @returns {Promise<User>}
     */
    public async create(name: string, email: string): Promise<User> {
        return this.userRepository.create({ name, email })
    }

    public async getByInviteKey(key: string): Promise<User | null> {
        return this.userRepository.findByInviteKey(key)
    }
}
