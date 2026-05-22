import { NextFunction, Request, Response } from 'express'
import OpenAI from 'openai'
import { PROMPT_CLASSIFIER_PROMPT } from '../config/constants'

/**
 * Runs the prompt through an OpenAI classifier to verify it describes a
 * valid moment before generation begins.
 * Assumes the prompt has already been validated for presence and length,
 * and screened for harmful content by PromptModerationMiddleware.
 * @class PromptClassifierMiddleware
 */
export default class PromptClassifierMiddleware {
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
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        const { prompt } = req.body

        let classification: { valid: boolean; reason?: string }
        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4o-mini',
                messages: [
                    { role: 'system', content: PROMPT_CLASSIFIER_PROMPT },
                    { role: 'user', content: prompt },
                ],
                response_format: { type: 'json_object' },
                temperature: 0,
                max_completion_tokens: 80,
            })

            classification = JSON.parse(response.choices[0]?.message?.content ?? '{}')
        } catch (e) {
            console.error('[PromptClassifierMiddleware] Classifier call failed:', e)
            res.status(500).json({ error: 'Internal server error' })
            return
        }

        if (!classification.valid) {
            return res.status(422).json({
                error: classification.reason ?? 'Your prompt does not describe a valid moment. Please provide more context.',
            })
        }

        next()
    }
}
