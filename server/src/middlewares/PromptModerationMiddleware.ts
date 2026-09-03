import { NextFunction, Request, Response } from 'express'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

/**
 * Intercepts prompts that contain harmful content (hate speech, violence,
 * harassment, phishing, scams, etc) via the OpenAI Moderation API.
 * @class PromptModerationMiddleware
 */
export default class PromptModerationMiddleware {
    /**
     * @constructor
     * @param {LLMServiceInterface} llmService
     */
    constructor(private llmService: LLMServiceInterface) {}

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void|Response> {
        const { prompt } = req.body

        const flagged = await this.llmService.moderateText(prompt)

        if (flagged) {
            return res.status(422).json({ error: 'Your message contains harmful or prohibited content and cannot be processed.' })
        }

        next()
    }
}
