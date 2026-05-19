import crypto from 'crypto'
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
     * Generate a new invite key for a user.
     * @param {number} userId
     * @returns {Promise<InviteKey>}
     */
    public async generate(userId: number): Promise<InviteKey> {
        let key: string
        do {
            key = crypto.randomBytes(9).toString('base64url')
        } while (await this.inviteKeyRepository.findBy('key', key))

        return this.inviteKeyRepository.create({ user_id: userId, key })
    }

    /**
     * Validate an invite key.
     * @param {string} key
     * @returns {Promise<boolean>}
     */
    public async validate(key: string): Promise<boolean> {
        const inviteKey = await this.inviteKeyRepository.findBy('key', key)
        return !!inviteKey
    }
}
