import { NextFunction, Request, Response } from 'express'
import OpenAI from 'openai'
import { Moderation } from 'openai/resources'

/**
 * Intercepts prompts that contain harmful content (hate speech, violence,
 * harassment, phishing, scams, etc) via the OpenAI Moderation API before
 * they reach PromptValidator.
 *
 * @class PromptSafetyMiddleware
 */
export default class PromptSafetyMiddleware {
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
        let categories: Moderation.Categories

        try {
            const moderation = await this.openai.moderations.create({
                model: 'omni-moderation-latest',
                input: prompt,
            })

            flagged = moderation.results[0].flagged
            categories = moderation.results[0].categories
        } catch (e) {
            console.error('[PromptSafetyMiddleware] Moderation API call failed:', e)
            // Fail open: if the moderation API is unavailable let the request
            // continue so that PromptValidator can still run its own checks.
            return next()
        }

        if (flagged) {
            console.warn('[PromptSafetyMiddleware] Prompt flagged by moderation API.', categories)
            return res.status(422).json({ error: 'Your message contains harmful or prohibited content and cannot be processed.' })
        }

        next()
    }
}
