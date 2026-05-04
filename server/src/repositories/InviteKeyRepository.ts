import InviteKeyRepositoryInterface from '../interfaces/InviteKeyRepositoryInterface'
import BaseRepository from './BaseRepository'
import InviteKey from '../models/InviteKey'

/**
 * @class InviteKeyRepository
 */
export default class InviteKeyRepository extends BaseRepository<InviteKey> implements InviteKeyRepositoryInterface {
    constructor() { super(InviteKey) }

    /**
     * Find an invite key record by its key string.
     * @param {string} key
     * @returns {Promise<InviteKey | null>}
     */
    async findByKey(key: string): Promise<InviteKey | null> {
        return this.findBy('key', key)
    }
}

