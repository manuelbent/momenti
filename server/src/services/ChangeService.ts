import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import ChangeRepositoryInterface from '../interfaces/ChangeRepositoryInterface'

/**
 * @class ChangeService
 */
export default class ChangeService implements ChangeServiceInterface {
    /**
     * @constructor
     * @param {ChangeRepositoryInterface} changeRepository
     */
    constructor(private changeRepository: ChangeRepositoryInterface) {}
}
