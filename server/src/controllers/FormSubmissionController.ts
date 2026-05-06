import { Request, Response } from 'express'
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

    /**
     * @param {Request} req
     * @param {Response} res
     */
    public async store(req: Request, res: Response) {
        res.send('storing...')
    }
}
