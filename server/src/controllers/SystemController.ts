import { Request, Response } from 'express'

/**
 * @class SystemController
 */
export default class SystemController {
    /**
     * @param {Request} _
     * @param {Response} res
     */
    public async healthcheck(_: Request, res: Response) {
        res.status(200).json({
            name: 'momenti',
            version: '0.0.0-alpha',
            description: 'AI-powered page builder. Your moment, one message away.',
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
