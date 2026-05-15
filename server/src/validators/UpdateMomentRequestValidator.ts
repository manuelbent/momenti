import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'

/**
 * @class UpdateMomentRequestValidator
 */
export default class UpdateMomentRequestValidator {
    /**
     * @private {ZodObject}
     */
    schema = z.object({
        slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug may only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.').optional(),
        prompt: z.string().optional(),
        content: z.record(z.unknown()).optional(),
        is_published: z.boolean().optional(),
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

        if (result.data.slug && await this.momentService.slugExists(result.data.slug, id)) {
            res.status(409).json({ error: 'A moment with this slug already exists.' })
            return
        }

        next()
    }
}
