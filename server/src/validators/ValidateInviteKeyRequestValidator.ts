import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

/**
 * @class ValidateInviteKeyRequestValidator
 */
export default class ValidateInviteKeyRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        invite_key: z.string().min(1),
    })

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
