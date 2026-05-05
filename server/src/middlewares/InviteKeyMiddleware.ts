import { NextFunction, Request, Response } from 'express'
import InviteKeyRepositoryInterface from '../interfaces/InviteKeyRepositoryInterface'

/**
 * @class InviteKeyMiddleware
 */
export default class InviteKeyMiddleware {
    /**
     * @constructor
     * @param {InviteKeyRepositoryInterface} inviteKeyRepository
     */
    constructor(private readonly inviteKeyRepository: InviteKeyRepositoryInterface) {}

    /**
     * Checks that the request contains a valid x-invite-key header and stores
     * the resolved InviteKey record in res.locals.inviteKey.
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<void>}
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        const key = req.headers['x-invite-key']

        if (!key || (typeof key === 'string' && key.trim() === '')) {
            res.status(401).json({ error: 'Missing x-invite-key header' })
            return
        }

        const inviteKey = await this.inviteKeyRepository.findBy('key', key as string)
        if (!inviteKey) {
            res.status(401).json({ error: 'Invalid invite key' })
            return
        }

        // set user as res prop
        res.locals.user = await inviteKey.getUser()

        next()
    }
}
