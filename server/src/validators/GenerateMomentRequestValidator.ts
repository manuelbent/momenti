import { NextFunction, Request, Response } from 'express'
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH } from '../config/constants'

/**
 * @class GenerateMomentRequestValidator
 */
export default class GenerateMomentRequestValidator {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { prompt } = req.body

        if (typeof prompt !== 'string' || prompt.length < MIN_PROMPT_LENGTH) {
            res.status(400).json({ error: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters.` })
            return
        }

        if (prompt.length > MAX_PROMPT_LENGTH) {
            res.status(400).json({ error: `Prompt must be at most ${MAX_PROMPT_LENGTH} characters.` })
            return
        }

        next()
    }
}
