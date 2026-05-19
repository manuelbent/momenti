import { NextFunction, Request, Response } from 'express'
import OpenAI from 'openai'

/**
 * Intercepts prompts that contain harmful content (hate speech, violence,
 * harassment, phishing, scams, etc) via the OpenAI Moderation API before
 * they reach PromptValidator.
 *
 * @class PromptModerationMiddleware
 */
export default class PromptModerationMiddleware {
    /**
     * @private {OpenAI}
     */
    private openai: OpenAI

    /**
     * @constructor
     */
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void|Response> {
        const { prompt } = req.body

        let flagged: boolean

        try {
            const moderation = await this.openai.moderations.create({
                model: 'omni-moderation-latest',
                input: prompt,
            })

            flagged = moderation.results[0].flagged
        } catch (e) {
            // Fail open: if the moderation API is unavailable let the request
            // continue so that PromptValidator can still run its own checks.
            return next()
        }

        if (flagged) {
            return res.status(422).json({ error: 'Your message contains harmful or prohibited content and cannot be processed.' })
        }

        next()
    }
}
