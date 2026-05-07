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
     * @param {string} formId
     * @param {Record<string, string>} data
     */
    async store(momentId: number, formId: string, data: Record<string, string>): Promise<FormSubmission> {
        return this.formSubmissionRepository.create({ moment_id: momentId, form_id: formId, data })
    }

    /**
     * @param {FormSubmission[]} formSubmissions
     * @returns {Promise<string | null>}
     */
    generateCSV(formSubmissions: FormSubmission[]): string|null {
        const fieldKeys = [...new Set(formSubmissions.flatMap(s => Object.keys(s.data)))]
        const headers = ['submitted_at', 'form_id', ...fieldKeys]

        const escape = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`

        const rows = formSubmissions.map(s => [
            escape(new Date(s.submitted_at).toISOString()),
            escape(s.form_id),
            ...fieldKeys.map(k => escape(s.data[k] ?? ''))
        ].join(','))

        return [headers.join(','), ...rows].join('\r\n')
    }
}
