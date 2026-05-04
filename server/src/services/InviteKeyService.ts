import InviteKey from '../models/InviteKey'
import InviteKeyRepositoryInterface from '../interfaces/InviteKeyRepositoryInterface'
import InviteKeyServiceInterface from '../interfaces/InviteKeyServiceInterface'

/**
 * @class InviteKeyService
 */
export default class InviteKeyService implements InviteKeyServiceInterface {
    /**
     * @constructor
     * @param {InviteKeyRepositoryInterface} inviteKeyRepository
     */
    constructor(private inviteKeyRepository: InviteKeyRepositoryInterface) {}

    /**
     * Validate an invite key.
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    public async validate(key: string): Promise<boolean> {
        const inviteKey = await this.inviteKeyRepository.findByKey(key)
        return !!inviteKey
    }
}

