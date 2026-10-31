import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'

/**
 * @class CreateImageRequestValidator
 */
export default class CreateImageRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        nodeId: z.string().trim().min(1).max(255),
        contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']),
        size: z.number().int().positive().max(5 * 1024 * 1024),
    }).strict()

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = Number(req.params.id)

        if (!Number.isSafeInteger(id) || id <= 0) {
            res.status(400).json({ error: 'Invalid moment id.' })
            return
        }

        const result = this.schema.safeParse(req.body)

        if (!result.success) {
            res.status(400).json({ error: result.error.issues })
            return
        }

        req.body = result.data
        next()
    }
}
