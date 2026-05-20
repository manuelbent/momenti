import Feedback, { FeedbackType } from '../models/Feedback'
import FeedbackRepositoryInterface from '../interfaces/FeedbackRepositoryInterface'
import FeedbackServiceInterface from '../interfaces/FeedbackServiceInterface'

/**
 * @class FeedbackService
 */
export default class FeedbackService implements FeedbackServiceInterface {
    /**
     * @constructor
     * @param {FeedbackRepositoryInterface} feedbackRepository
     */
    constructor(private feedbackRepository: FeedbackRepositoryInterface) {}

    /**
     * Store a new feedback entry.
     * @param {number} userId
     * @param {FeedbackType} type
     * @param {string} message
     * @returns {Promise<Feedback>}
     */
    public async store(userId: number, type: FeedbackType, message: string): Promise<Feedback> {
        return this.feedbackRepository.create({ user_id: userId, type, message })
    }
}
