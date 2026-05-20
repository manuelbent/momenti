import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

/**
 * @class SubmitFeedbackRequestValidator
 */
export default class SubmitFeedbackRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        type: z.enum(['bug', 'suggestion', 'other']),
        message: z.string().min(10).max(5000),
    }).strict()

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
