import { NextFunction, Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

/**
 * Runs the prompt through an OpenAI classifier to verify it describes a
 * valid moment before generation begins.
 * Assumes the prompt has already been validated for presence and length,
 * and screened for harmful content by PromptModerationMiddleware.
 * @class PromptClassifierMiddleware
 */
export default class PromptClassifierMiddleware {
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
            emit(res, 'progress', { stage: 'classifying' })
            const classification = await this.llmService.classifyPrompt(prompt)

            if (!classification.valid) {
                const error = classification.reason ?? 'Your prompt does not describe an event. momenti builds a page for a specific event. Try describing your wedding, party, reunion, or celebration.'
                emit(res, 'error', { error }, true)
                return
            }

            next()
        } catch (err) {
            logger.error({ err }, '[PromptClassifierMiddleware] Prompt classification error')
            emit(res, 'error', { error: 'Failed to understand your prompt. Please try again.' }, true)
        }
    }
}
