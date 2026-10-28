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
     * Generates and uploads the hero image before Moment generation starts.
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

            next()
        } catch (err) {
            logger.error({ err }, '[ImageGenerationController] Image generation error')
            emit(res, 'error', { error: 'Failed to generate the hero image.' }, true)
        }
    }
}
