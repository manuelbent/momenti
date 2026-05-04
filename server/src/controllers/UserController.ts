import UserServiceInterface from '../interfaces/UserServiceInterface'

/**
 * @class UserController
 */
export default class UserController {
    /**
     * @constructor
     * @param {UserServiceInterface} userService
     */
    constructor(private userService: UserServiceInterface) {}
}
