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
}
