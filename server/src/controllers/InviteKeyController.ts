import { Request, Response } from 'express'
import InviteKeyServiceInterface from '../interfaces/InviteKeyServiceInterface'

/**
 * @class InviteKeyController
 */
export default class InviteKeyController {
    /**
     * @constructor
     * @param {InviteKeyServiceInterface} inviteKeyService
     */
    constructor(private inviteKeyService: InviteKeyServiceInterface) {}

    /**
     * Validate an invite key.
     * @param {Request} req
     * @param {Response} res
     */
    public async validate(req: Request, res: Response): Promise<void> {
        try {
            const { invite_key } = req.body
            const isValid = await this.inviteKeyService.validate(invite_key)
            res.status(200).json({ isValid })
        } catch (err) {
            console.error('[InviteKeyController] validate error:', err)
            res.status(500).json({ error: 'Internal server error.' })
        }
    }
}

