import { NextFunction, Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
import R2Service from '../services/R2Service'
import RedisService from '../services/RedisService'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

/**
 * @class ImageGenerationController
 */
export default class ImageGenerationController {
    /**
     * @constructor
     * @param {R2Service} r2Service
     * @param {LLMServiceInterface} llmService
     * @param {RedisService} redisService
     */
    constructor(
        private r2Service: R2Service,
        private llmService: LLMServiceInterface,
        private redisService: RedisService,
    ) {}

    /**
     * Prepares a hero image, falling back to a placeholder on failure.
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { user, generationId } = res.locals
        const context: LLMRequestContext = { userId: user.id, generationId }
        try {
            const planning: GenerationProgress = { stage: 'planning-image' }
            const planningId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', planning)
            emit(res, 'progress', planning, false, planningId)
            const imagePrompt = await this.llmService.generateImagePrompt(req.body.prompt, context)

            const generating: GenerationProgress = { stage: 'generating-image' }
            const generatingId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', generating)
            emit(res, 'progress', generating, false, generatingId)
            const buffer = await this.llmService.generateImage(imagePrompt, context)

            const uploading: GenerationProgress = { stage: 'uploading-image' }
            const uploadingId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', uploading)
            emit(res, 'progress', uploading, false, uploadingId)
            res.locals.heroImageUrl = await this.r2Service.upload(
                buffer,
                'image/png',
                'generated.png',
            )
        } catch (err) {
            logger.warn({ err }, '[ImageGenerationController] Image preparation failed, using placeholder')
            res.locals.heroImageUrl = 'https://placehold.co/1536x1024/png'
        }

        next()
    }
}
