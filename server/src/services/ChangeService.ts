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
     * @param {Partial<Change>} data
     */
    public async store(data: Partial<Change>): Promise<Change> {
        return this.changeRepository.create(data)
    }

    /**
     * Retrieve all changes for a moment, ordered by creation time.
     * @param {number} momentId
     */
    public async getAll(momentId: number): Promise<Change[]> {
        return this.changeRepository.getAllByMomentId(momentId)
    }
}
