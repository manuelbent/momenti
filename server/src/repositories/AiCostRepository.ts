import AiCostRepositoryInterface from '../interfaces/AiCostRepositoryInterface'
import BaseRepository from './BaseRepository'
import AiCost from '../models/AiCost'

/**
 * @class AiCostRepository
 */
export default class AiCostRepository extends BaseRepository<AiCost> implements AiCostRepositoryInterface {
    constructor() { super(AiCost) }
}
