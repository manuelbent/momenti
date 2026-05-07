import { NextFunction, Request, Response } from 'express'
import User from '../models/User'

/**
 * @class DownloadFormSubmissionsMiddleware
 */
export default class DownloadFormSubmissionsMiddleware {
    /**
     * Checks if the current user can view the form submissions.
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<void>}
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.accepts('text/csv')) {
            res.status(406).json({ error: 'Unacceptable request.' })
            return
        }

        const user: User = res.locals.user
        if (!user) {
            console.error('[DownloadFormSubmissionMiddleware] could not get user from locals.')
            res.status(422).json({ error: 'Unprocessable request.' })
            return
        }

        const slug = String(req.params.slug)
        const [moment] = await user.getMoments({ where: { slug } })
        if (!moment) {
            res.status(403).json({ error: 'Forbidden.' })
            return
        }

        // set moment as res prop
        res.locals.moment = moment

        next()
    }
}
