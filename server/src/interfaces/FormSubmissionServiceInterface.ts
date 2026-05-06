import FormSubmission from '../models/FormSubmission'

/**
 * @interface FormSubmissionServiceInterface
 */
export default interface FormSubmissionServiceInterface {
    store(momentId: number, data: Record<string, string>): Promise<FormSubmission>
}
