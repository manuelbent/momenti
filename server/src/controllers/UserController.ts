import { Request, Response } from 'express'
import logger from '../config/logger'
import User from '../models/User'
import RedisService from '../services/RedisService'

/**
 * @class UserController
 */
export default class UserController {
    /**
     * @constructor
     * @param {RedisService} redisService
     */
    constructor(private redisService: RedisService) {}

    public async me(_: Request, res: Response): Promise<void> {
        const user: User = res.locals.user
        res.setHeader('Cache-Control', 'no-store')

        try {
            const isGenerating = await this.redisService.isGenerating(user.id)
            res.status(200).json({ id: user.id, isGenerating })
        } catch (err) {
            logger.error({ err, userId: user.id }, '[UserController] Failed to load current user')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }
}
