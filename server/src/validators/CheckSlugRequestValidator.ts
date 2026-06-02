import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

/**
 * @class CheckSlugRequestValidator
 */
export default class CheckSlugRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        slug: z.string(),
        excludedId: z.string(),
    })

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = this.schema.safeParse(req.query)

        if (!result.success) {
            res.status(400).json({ error: result.error.issues })
            return
        }

        next()
    }
}
