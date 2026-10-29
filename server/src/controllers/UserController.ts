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

    /**
     * Returns the authenticated user's id and whether a generation is in progress.
     * Requires `InviteKeyMiddleware` to have set `res.locals.user`.
     * @param {Request} _
     * @param {Response} res
     * @returns {Promise<void>}
     */
    public async me(_: Request, res: Response): Promise<void> {
        res.setHeader('Cache-Control', 'no-store')
        const user: User = res.locals.user

        try {
            const isGenerating = await this.redisService.isGenerating(user.id)
            res.status(200).json({ id: user.id, isGenerating })
        } catch (err) {
            logger.error({ err, userId: user.id }, '[UserController] Failed to load current user')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }
}
