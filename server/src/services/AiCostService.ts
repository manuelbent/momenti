import { TOKEN_RATES_USD } from '../config/constants'
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

    /**
     * Calculate and store the cost of a completed AI request.
     * @param {Partial<AiCost>} data
     * @returns {Promise<AiCost>}
     */
    public async record(data: Partial<AiCost>): Promise<AiCost> {
        const rates = TOKEN_RATES_USD[data.model as keyof typeof TOKEN_RATES_USD]
        if (!rates) {
            throw new Error(`No token rates configured for AI model "${data.model}".`)
        }

        const costUsd = data.model === 'omni-moderation-latest'
            ? 0
            : data.input_tokens == null || data.output_tokens == null
                ? null
                : Number(((data.input_tokens * rates.input) + (data.output_tokens * rates.output)).toFixed(12))

        return this.store({
            ...data,
            cost_usd: costUsd,
        })
    }
}
