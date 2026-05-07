import { Request, Response } from 'express'
import FormSubmissionServiceInterface from '../interfaces/FormSubmissionServiceInterface'
import Moment from '../models/Moment'

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
     * @param {Request} _
     * @param {Response} res
     */
    public async download(_: Request, res: Response) {
        try {
            const moment: Moment = res.locals.moment
            const formSubmissions = await moment.getFormSubmissions()
            if (!formSubmissions.length) {
                res.status(204).send()
                return
            }

            const csv = this.formSubmissionService.generateCSV(formSubmissions)

            res.setHeader('Content-Type', 'text/csv')
            res.setHeader('Content-Disposition', `attachment; filename="${moment.slug}-responses.csv"`)
            res.status(200).send(csv)
        } catch (err) {
            console.error('[FormSubmissionController] download form submissions error:', err)
            res.status(500).json({ error: 'Internal server error.' })
        }
    }
}
