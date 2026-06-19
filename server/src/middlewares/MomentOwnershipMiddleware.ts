import { NextFunction, Request, Response } from 'express'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'

/**
 * @class MomentOwnershipMiddleware
 */
export default class MomentOwnershipMiddleware {
    /**
     * @constructor
     * @param momentService
     */
    constructor(private momentService: MomentServiceInterface) {}

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<void>}
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { user } = res.locals
        const { id } = req.params

        const moment = await this.momentService.getById(Number(id))
        if (!moment) {
            res.status(404).json({ error: 'Moment not found.' })
            return
        }

        if (moment.user_id !== user.id) {
            res.status(403).json({ error: 'Forbidden.' })
            return
        }

        next()
    }
}
