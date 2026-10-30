import { NextFunction, Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
import RedisService from '../services/RedisService'
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
            const progress: GenerationProgress = { stage: 'moderating' }
            const progressId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', progress)
            emit(res, 'progress', progress, false, progressId)

            const flagged = await this.llmService.moderateText(prompt, {
                correlationId: res.locals.correlationId,
                momentId: req.params.id ? Number(req.params.id) : null,
            })

            if (flagged) {
                const error = 'Your message contains harmful or prohibited content and cannot be processed.'
                const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', { error })
                emit(res, 'error', { error }, true, eventId)

                await this.redisService.releaseGenerationLock(res.locals.user.id, res.locals.generationId)
                return
            }

            next()
        } catch (err) {
            logger.error({ err }, '[PromptModerationMiddleware] Prompt moderation error')
            const error = 'Failed to review your prompt. Please try again.'
            const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', { error })
            emit(res, 'error', { error }, true, eventId)

            await this.redisService.releaseGenerationLock(res.locals.user.id, res.locals.generationId)
        }
    }

}
