import UserRepositoryInterface from '../interfaces/UserRepositoryInterface'
import BaseRepository from './BaseRepository'
import User from '../models/User'

export default class UserRepository extends BaseRepository<User> implements UserRepositoryInterface {
    constructor() { super(User) }
}
