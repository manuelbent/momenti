import { NextFunction, Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
import RedisService from '../services/RedisService'
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
     * @param {RedisService} redisService
     */
    constructor(
        private llmService: LLMServiceInterface,
        private redisService: RedisService,
    ) {}

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { prompt } = req.body
        const { user, generationId } = res.locals

        try {
            const progress: GenerationProgress = { stage: 'classifying' }
            const progressId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', progress)
            emit(res, 'progress', progress, false, progressId ?? undefined)

            const classification = await this.llmService.classifyPrompt(prompt)

            if (!classification.valid) {
                const error = classification.reason
                    ?? 'Your prompt does not describe an event. momenti builds a page for a specific event. Try describing your wedding, party, reunion, or celebration.'
                const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', { error })
                emit(res, 'error', { error }, true, eventId ?? undefined)

                await this.redisService.releaseGenerationLock(res.locals.user.id, res.locals.generationId)
                return
            }

            next()
        } catch (err) {
            logger.error({ err }, '[PromptClassifierMiddleware] Prompt classification error')
            const error = 'Failed to understand your prompt. Please try again.'
            const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', { error })
            emit(res, 'error', { error }, true, eventId ?? undefined)

            await this.redisService.releaseGenerationLock(res.locals.user.id, res.locals.generationId)
        }
    }

}
