import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH } from '../config/constants'

const patchMomentSchema = z.object({
    nodeId: z.string().optional(),
    prompt: z.string().trim().min(MIN_PROMPT_LENGTH).max(MAX_PROMPT_LENGTH),
    content: z.object({
        slug: z.string(),
        fonts: z.array(z.string()).optional(),
        stylesheet: z.string().max(100_000).optional(),
        root: z.record(z.string(), z.unknown()),
    }),
})

/**
 * @class PatchMomentRequestValidator
 */
export default class PatchMomentRequestValidator {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const result = patchMomentSchema.safeParse(req.body)

        if (!result.success) {
            const error = result.error.issues[0]?.message ?? 'Invalid request body.'
            res.status(400).json({ error })
            return
        }

        next()
    }
}
