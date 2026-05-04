import UserRepositoryInterface from '../interfaces/UserRepositoryInterface'
import BaseRepository from './BaseRepository'
import User from '../models/User'
import InviteKey from '../models/InviteKey'

export default class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {
    constructor() { super(User) }

    /**
     * Find a user by their invite key.
     * @param {string} key
     * @returns {Promise<User | null>}
     */
    async findByInviteKey(key: string): Promise<User | null> {
        return User.findOne({
            include: [
                {
                model: InviteKey,
                where: { key },
                required: true
            }]
        })
    }
}
