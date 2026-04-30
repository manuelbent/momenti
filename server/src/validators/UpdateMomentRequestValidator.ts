import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

/**
 * @class UpdateMomentRequestValidator
 */
export default class UpdateMomentRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        slug: z.string().optional(),
        prompt: z.string().optional(),
        content: z.record(z.unknown()).optional(),
        is_published: z.boolean().optional(),
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
        const id = Number(req.params.id)

        if (isNaN(id)) {
            res.status(400).json({ error: 'Invalid moment id.' })
            return
        }

        const result = this.schema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({ error: result.error.issues })
            return
        }

        next()
    }
}
