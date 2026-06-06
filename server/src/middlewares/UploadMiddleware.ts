import multer from 'multer'
import { NextFunction, Request, Response } from 'express'

/**
 * Handles multipart/form-data file uploads.
 * Keeps files in memory (no temp disk writes) and restricts
 * uploads to image MIME types up to 4 MB.
 * @class UploadMiddleware
 */
export default class UploadMiddleware {
    /**
     * @private {multer.Multer}
     */
    private readonly multerSingle

    /**
     * @constructor
     */
    constructor() {
        this.multerSingle = multer({
            storage: multer.memoryStorage(),
            limits: { fileSize: 5 * 1024 * 1024 },
            fileFilter: (_req, file, cb) => {
                if (file.mimetype.startsWith('image/')) cb(null, true)
                else cb(new Error('Only image files are allowed.'))
            },
        }).single('file')
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {void}
     */
    public handle = (req: Request, res: Response, next: NextFunction): void => {
        this.multerSingle(req, res, (err) => {
            if (err) {
                res.status(400).json({ error: err.message })
                return
            }
            next()
        })
    }
}

