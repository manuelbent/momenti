import { Request, Response } from 'express'
import FormSubmissionServiceInterface from '../interfaces/FormSubmissionServiceInterface'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import Moment from '../models/Moment'

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
            const { form_id, data } = req.body
            const moment: Moment = res.locals.moment
            await this.formSubmissionService.store(moment.id, form_id, data)
            res.status(204).send()
        } catch (err) {
            console.error('[FormSubmissionController] store error:', err)
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * @param {Request} req
     * @param {Response} res
     */
    public async download(req: Request, res: Response) {
        res.status(200).json({ exporting: true })
    }
}
