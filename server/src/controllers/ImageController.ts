import { Request, Response } from 'express'
import logger from '../config/logger'
import R2Service from '../services/R2Service'

/**
 * @class ImageController
 */
export default class ImageController {
    /**
     * @constructor
     * @param {R2Service} r2Service
     */
    constructor(private r2Service: R2Service) {}

    /**
     * Authorize a direct image upload to R2 without receiving file bytes.
     * @param {Request} req
     * @param {Response} res
     */
    public async getPresignedUrl(req: Request, res: Response): Promise<void> {
        const momentId = Number(req.params.id)
        const { contentType, size } = req.body

        try {
            const { uploadId, uploadUrl, url, headers, expiresAt } = await this.r2Service.getPresignedUploadUrl({
                momentId,
                contentType,
                size,
            })

            res.setHeader('Cache-Control', 'no-store')
            res.status(201).json({ uploadId, uploadUrl, url, headers, expiresAt })
        } catch (err) {
            logger.error({ err, momentId }, '[ImageController] getPresignedUploadUrl error')
            res.status(500).json({ error: 'Failed to authorize image upload.' })
        }
    }
}
