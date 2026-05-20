import Feedback, { FeedbackType } from '../models/Feedback'

/**
 * @interface FeedbackServiceInterface
 */
export default interface FeedbackServiceInterface {
    store(userId: number, type: FeedbackType, message: string): Promise<Feedback>
}
