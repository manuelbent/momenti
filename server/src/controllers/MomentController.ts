import { Request, Response } from 'express'
import logger from '../config/logger'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import User from '../models/User'

/**
 * @class MomentController
 */
export default class MomentController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     * @param {ChangeServiceInterface} changeService
     */
    constructor(
        private momentService: MomentServiceInterface,
        private changeService: ChangeServiceInterface,
    ) {}

    /**
     * Load all moments by invite key.
     * @param {Request} _
     * @param {Response} res
     */
    public async loadAll(_: Request, res: Response) {
        try {
            const user: User = res.locals.user
            const moments = await user.getMoments({ order: [['created_at', 'DESC']] })
            res.json(moments)
        } catch (err) {
            logger.error({ err }, '[MomentController] load all moments error')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * This function is public, because consumed by the viewer.
     * A moment is loaded by slug, if published.
     * @param {Request} req
     * @param {Response} res
     */
    public async loadPublishedBySlug(req: Request, res: Response) {
        try {
            const slug = String(req.params.slug)
            const moment = await this.momentService.getPublishedBySlug(slug)
            res.json(moment)
        } catch (err) {
            logger.error({ err }, '[MomentController] load moment by slug')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * Load all changes for a moment.
     * @param {Request} req
     * @param {Response} res
     */
    public async loadChanges(req: Request, res: Response) {
        try {
            const { id } = req.params
            const changes = await this.changeService.getAll(Number(id))
            res.json(changes)
        } catch (err) {
            logger.error({ err }, '[MomentController] load changes error')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

    /**
     * Update the moment.
     * @param {Request} req
     * @param {Response} res
     */
    public async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)
            const moment = await this.momentService.update(id, req.body)
            res.json(moment)
        } catch (err) {
            logger.error({ err }, '[MomentController] update error')
            res.status(404).json({ error: 'Moment not found.' })
        }
    }

    /**
     * Check if a slug already exists.
     * @param {Request} req
     * @param {Response} res
     */
    public async checkSlug(req: Request, res: Response) {
        try {
            const { slug, excludedId } = req.query
            const exists = await this.momentService.slugExists(String(slug), Number(excludedId))
            res.json({ isAvailable: !exists })
        } catch (err) {
            logger.error({ err }, '[MomentController] check slug error')
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

}
