import AiCost from '../models/AiCost'
import AiCostRepositoryInterface from '../interfaces/AiCostRepositoryInterface'
import AiCostServiceInterface from '../interfaces/AiCostServiceInterface'

/**
 * @class AiCostService
 */
export default class AiCostService implements AiCostServiceInterface {
    /**
     * @constructor
     * @param {AiCostRepositoryInterface} aiCostRepository
     */
    constructor(private aiCostRepository: AiCostRepositoryInterface) {}

    /**
     * Store a new AI cost entry.
     * @param {Partial<AiCost>} data
     * @returns {Promise<AiCost>}
     */
    public async store(data: Partial<AiCost>): Promise<AiCost> {
        return this.aiCostRepository.create(data)
    }
}
