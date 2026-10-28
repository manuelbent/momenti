import { NextFunction, Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
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
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { prompt } = req.body

        try {
            emit(res, 'progress', { stage: 'moderating' })
            const flagged = await this.llmService.moderateText(prompt)

            if (flagged) {
                const error = 'Your message contains harmful or prohibited content and cannot be processed.'
                emit(res, 'error', { error }, true)
                return
            }

            next()
        } catch (err) {
            logger.error({ err }, '[PromptModerationMiddleware] Prompt moderation error')
            emit(res, 'error', { error: 'Failed to review your prompt. Please try again.' }, true)
        }
    }
}
