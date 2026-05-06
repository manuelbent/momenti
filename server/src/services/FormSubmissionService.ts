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

    async store(momentId: number, data: Record<string, string>): Promise<FormSubmission> {
        return this.formSubmissionRepository.create({ moment_id: momentId, data } as any)
    }
}
