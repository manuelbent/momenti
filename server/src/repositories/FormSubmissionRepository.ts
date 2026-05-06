import BaseRepository from './BaseRepository'
import FormSubmission from '../models/FormSubmission'
import FormSubmissionRepositoryInterface from '../interfaces/FormSubmissionRepositoryInterface'

export default class FormSubmissionRepository extends BaseRepository<FormSubmission> implements FormSubmissionRepositoryInterface {
    constructor() { super(FormSubmission) }
}
