import InviteKeyRepositoryInterface from '../interfaces/InviteKeyRepositoryInterface'
import BaseRepository from './BaseRepository'
import InviteKey from '../models/InviteKey'

/**
 * @class InviteKeyRepository
 */
export default class InviteKeyRepository extends BaseRepository<InviteKey> implements InviteKeyRepositoryInterface {
    constructor() { super(InviteKey) }
}
