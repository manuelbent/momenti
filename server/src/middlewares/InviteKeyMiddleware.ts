import { Request, Response, NextFunction } from 'express'

/**
 * @class InviteKeyMiddleware
 */
export default class InviteKeyMiddleware {
    /**
     * Checks that the request contains a non-empty x-invite-key header.
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {void}
     */
    public handle(req: Request, res: Response, next: NextFunction): void {
        const inviteKey = req.headers['x-invite-key']

        if (!inviteKey || (typeof inviteKey === 'string' && inviteKey.trim() === '')) {
            res.status(401).json({ error: 'Missing x-invite-key header' })
            return
        }

        next()
    }
}

