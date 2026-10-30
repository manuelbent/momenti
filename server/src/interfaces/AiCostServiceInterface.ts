import AiCost from '../models/AiCost'

/**
 * @interface AiCostServiceInterface
 */
export default interface AiCostServiceInterface {
    store(data: Partial<AiCost>): Promise<AiCost>
}
