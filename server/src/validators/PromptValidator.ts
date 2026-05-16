import { NextFunction, Request, Response } from 'express'
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH } from '../config/constants'

/**
 * Validates the presence and length of the prompt field before any
 * network-based checks are performed.
 *
 * @class PromptValidator
 */
export default class PromptValidator {
    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public handle(req: Request, res: Response, next: NextFunction): void {
        const { prompt } = req.body

        if (!prompt || prompt.trim().length < MIN_PROMPT_LENGTH) {
            res.status(422).json({ error: 'The message is too short. Please describe your moment in more detail.' })
            return
        }

        if (prompt.length > MAX_PROMPT_LENGTH) {
            res.status(422).json({ error: `The message is too long. Please keep it under ${MAX_PROMPT_LENGTH} characters.` })
            return
        }


        next()
    }
}
