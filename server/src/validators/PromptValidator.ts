import { NextFunction, Request, Response } from 'express'
import OpenAI from 'openai'
import { MAX_PROMPT_LENGTH, MIN_PROMPT_LENGTH, PROMPT_CLASSIFIER_PROMPT } from '../config/constants'

/**
 * @class PromptValidator
 */
export default class PromptValidator {
    private openai: OpenAI

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

        // prompt length validation
        if (!prompt || prompt.trim().length < MIN_PROMPT_LENGTH) {
            res.status(422).json({ error: 'The message is too short. Please describe your moment in more detail.' })
            return
        }

        if (prompt.length > MAX_PROMPT_LENGTH) {
            res.status(422).json({ error: `The message is too long. Please keep it under ${MAX_PROMPT_LENGTH} characters.` })
            return
        }

        // openai pre-validation
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
            console.error('[PromptValidator] Classifier call failed:', e)
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
