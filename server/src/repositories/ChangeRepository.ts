import ChangeRepositoryInterface from '../interfaces/ChangeRepositoryInterface'
import BaseRepository from './BaseRepository'
import Change from '../models/Change'

export default class ChangeRepository extends BaseRepository<Change> implements ChangeRepositoryInterface {
    constructor() { super(Change) }

    /**
     * Retrieve all changes for a moment, ordered by creation time.
     * @param {number} momentId
     * @return {Promise<Change[]>}
     */
    getAllByMomentId(momentId: number): Promise<Change[]> {
        return this.model.findAll({
            where: { moment_id: momentId },
            order: [['created_at', 'ASC']],
        })
    }
}
