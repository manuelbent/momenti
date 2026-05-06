import FormSubmission from '../models/FormSubmission'
import FormSubmissionRepositoryInterface from '../interfaces/FormSubmissionRepositoryInterface'
import FormSubmissionServiceInterface from '../interfaces/FormSubmissionServiceInterface'

/**
 * @class FormSubmissionService
 */
export default class FormSubmissionService implements FormSubmissionServiceInterface {
    /**
     * @constructor
     * @param {FormSubmissionRepositoryInterface} formSubmissionRepository
     */
    constructor(private formSubmissionRepository: FormSubmissionRepositoryInterface) {}

    /**
     * @param {number} momentId
     * @param {Record<string, string>} data
     */
    async store(momentId: number, data: Record<string, string>): Promise<FormSubmission> {
        return this.formSubmissionRepository.create({ moment_id: momentId, data })
    }
}
