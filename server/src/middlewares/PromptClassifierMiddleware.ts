import { NextFunction, Request, Response } from 'express'
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
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        const { prompt } = req.body

        const classification = await this.llmService.classifyPrompt(prompt)

        if (!classification.valid) {
            return res.status(422).json({
                error: classification.reason ?? 'Your prompt does not describe an event. momenti builds a page for a specific event. Try describing your wedding, party, reunion, or celebration.',
            })
        }

        next()
    }
}
