import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

/**
 * @class GenerateMomentRequestValidator
 */
export default class GenerateMomentRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        prompt: z.string(),
    }).strict()

    /**
     * @constructor
     */
    constructor() {}

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = this.schema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({ error: result.error.issues })
            return
        }

        next()
    }
}
