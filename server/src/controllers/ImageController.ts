import { Request, Response } from 'express'
import R2Service from '../services/R2Service'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'
import logger from '../config/logger'

/**
 * @class ImageController
 */
export default class ImageController {
    /**
     * @constructor
     * @param {ImageServiceInterface} imageService
     * @param {R2Service} r2Service
     */
    constructor(
        private imageService: ImageServiceInterface,
        private r2Service: R2Service
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

            const url = await this.r2Service.upload(file.buffer, file.mimetype, file.originalname)
            res.status(201).json({ url })
        } catch (err) {
            logger.error({ err }, '[ImageController] upload error')
            res.status(500).json({ error: 'Failed to upload image.' })
        }
    }
}

