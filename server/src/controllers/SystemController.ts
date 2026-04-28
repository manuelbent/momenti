import { Request, Response } from 'express'

/**
 * @class SystemController
 */
class SystemController {
    /**
     * @param {Request} _
     * @param {Response} res
     */
    public async healthcheck(_: Request, res: Response) {
        res.status(200).json({
            name: 'Momenti',
            version: '0.0.1-alfa',
            description: 'AI-powered landing page builder.',
        })
    }

    /**
     * Responds with a 404 Not Found status.
     * @param {Request} _
     * @param {Response} res
     */
    public async notFound(_: Request, res: Response) {
        res.status(404).json({
            message: 'Looks like there is nothing here. 🔎',
        })
    }
}

export default new SystemController()
