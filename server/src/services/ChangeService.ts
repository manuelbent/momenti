import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import ChangeRepositoryInterface from '../interfaces/ChangeRepositoryInterface'
import Change from '../models/Change'

/**
 * @class ChangeService
 */
export default class ChangeService implements ChangeServiceInterface {
    /**
     * @constructor
     * @param {ChangeRepositoryInterface} changeRepository
     */
    constructor(private changeRepository: ChangeRepositoryInterface) {}

    /**
     * Persist change to DB.
     * @param {Partial<Moment>} data
     */
    public async store(data: Partial<Moment>): Promise<Change> {
        return this.changeRepository.create(data)
    }
}
