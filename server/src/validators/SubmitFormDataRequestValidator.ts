import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'

/**
 * @class SubmitFormDataRequestValidator
 */
export default class SubmitFormDataRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        data: z.record(z.string(), z.string())
    }).strict()

    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     */
    constructor(private momentService: MomentServiceInterface) {}

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const slug = String(req.params.slug)
        if (!slug) {
            res.status(400).json({ error: 'Invalid moment slug.' })
            return
        }

        const result = this.schema.safeParse(req.body)
        if (!result.success) {
            res.status(400).json({ error: result.error.issues })
            return
        }

        if (!await this.momentService.slugExists(slug)) {
            res.status(409).json({ error: 'The provided slug does not exist.' })
            return
        }

        next()
    }
}
