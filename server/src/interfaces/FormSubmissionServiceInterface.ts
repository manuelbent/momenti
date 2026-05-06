import FormSubmission from '../models/FormSubmission'

/**
 * @interface FormSubmissionServiceInterface
 */
export default interface FormSubmissionServiceInterface {
    store(momentId: number, formId: string, data: Record<string, string>): Promise<FormSubmission>
}
