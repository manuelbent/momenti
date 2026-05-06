import FormSubmissionServiceInterface from '../interfaces/FormSubmissionServiceInterface'

/**
 * @class FormSubmissionController
 */
export default class FormSubmissionController {
    /**
     * @constructor
     * @param {FormSubmissionServiceInterface} formSubmissionService
     */
    constructor(private formSubmissionService: FormSubmissionServiceInterface) {}
}
