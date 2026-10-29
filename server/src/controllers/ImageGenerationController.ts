import { NextFunction, Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
import RedisService from '../services/RedisService'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import R2ServiceInterface from '../interfaces/R2ServiceInterface'

/**
 * @class ImageGenerationController
 */
export default class ImageGenerationController {
    /**
     * @constructor
     * @param {ImageServiceInterface} imageService
     * @param {R2ServiceInterface} r2Service
     * @param {LLMServiceInterface} llmService
     * @param {RedisService} redisService
     */
    constructor(
        private imageService: ImageServiceInterface,
        private r2Service: R2ServiceInterface,
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
        try {
            const planning: GenerationProgress = { stage: 'planning-image' }
            const planningId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', planning)
            emit(res, 'progress', planning, false, planningId ?? undefined)
            const imagePrompt = await this.llmService.generateImagePrompt(req.body.prompt)

            const generating: GenerationProgress = { stage: 'generating-image' }
            const generatingId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', generating)
            emit(res, 'progress', generating, false, generatingId ?? undefined)
            const buffer = await this.imageService.generate(imagePrompt)

            const uploading: GenerationProgress = { stage: 'uploading-image' }
            const uploadingId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', uploading)
            emit(res, 'progress', uploading, false, uploadingId ?? undefined)
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
