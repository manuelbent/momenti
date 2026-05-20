import FeedbackRepositoryInterface from '../interfaces/FeedbackRepositoryInterface'
import BaseRepository from './BaseRepository'
import Feedback from '../models/Feedback'

/**
 * @class FeedbackRepository
 */
export default class FeedbackRepository extends BaseRepository<Feedback> implements FeedbackRepositoryInterface {
    constructor() { super(Feedback) }
}
