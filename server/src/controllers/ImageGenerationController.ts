import { NextFunction, Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
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
     */
    constructor(
        private imageService: ImageServiceInterface,
        private r2Service: R2ServiceInterface,
        private llmService: LLMServiceInterface,
    ) {}

    /**
     * Prepares a hero image, falling back to a placeholder on failure.
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            emit(res, 'progress', { stage: 'planning-image' })
            const imagePrompt = await this.llmService.generateImagePrompt(req.body.prompt)

            emit(res, 'progress', { stage: 'generating-image' })
            const buffer = await this.imageService.generate(imagePrompt)

            emit(res, 'progress', { stage: 'uploading-image' })
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
