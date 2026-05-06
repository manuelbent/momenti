import { Request, Response } from 'express'
import FormSubmissionServiceInterface from '../interfaces/FormSubmissionServiceInterface'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'

/**
 * @class FormSubmissionController
 */
export default class FormSubmissionController {
    /**
     * @constructor
     * @param {FormSubmissionServiceInterface} formSubmissionService
     * @param {MomentRepositoryInterface} momentRepository
     */
    constructor(
        private formSubmissionService: FormSubmissionServiceInterface,
        private momentRepository: MomentRepositoryInterface
    ) {}

    /**
     * @param {Request} req
     * @param {Response} res
     */
    public async store(req: Request, res: Response) {
        try {
            const { slug } = req.params
            const { data } = req.body
            // todo
        } catch (err) {
            console.error('[FormSubmissionController] store error:', err)
            res.status(500).json({ error: 'Internal server error.' })
        }
    }
}
