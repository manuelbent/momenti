import { Request, Response } from 'express'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'
import R2ServiceInterface from '../interfaces/R2ServiceInterface'
import logger from '../config/logger'

/**
 * @class ImageController
 */
export default class ImageController {
    /**
     * @constructor
     * @param {ImageServiceInterface} imageService
     * @param {R2ServiceInterface} r2Service
     */
    constructor(
        private imageService: ImageServiceInterface,
        private r2Service: R2ServiceInterface
    ) {}

    /**
     * Upload an image to R2 and return its permanent public URL.
     * Expects a multipart/form-data request with a field named "file".
     * @param {Request} req
     * @param {Response} res
     */
    public async upload(req: Request, res: Response): Promise<void> {
        try {
            const file = req.file
            if (!file) {
                res.status(400).json({ error: 'No file provided.' })
                return
            }

            // upload to R2
            const url = await this.r2Service.upload(file.buffer, file.mimetype, file.originalname)

            // store in DB
            await this.imageService.store({ url, type: 'uploaded' })

            res.status(201).json({ url })
        } catch (err) {
            logger.error({ err }, '[ImageController] upload error')
            res.status(500).json({ error: 'Failed to upload image.' })
        }
    }

    /**
     * Generates an image from a given prompt.
     * The image is then uploaded to R2 and stored in the DB.
     * @param {Request} req
     * @param {Response} res
     */
    public async generate(req: Request, res: Response): Promise<void> {
        try {
            const { prompt } = req.body
            const image = await this.imageService.generate(prompt)
            const url = await this.r2Service.upload(image, 'image/png', 'generated.png')
            await this.imageService.store({ url, type: 'generated' })
            res.status(201).json({ url })
        } catch (err) {
            logger.error({ err }, '[ImageController] generate error')
            res.status(500).json({ error: 'Failed to generate image.' })
        }
    }
}
