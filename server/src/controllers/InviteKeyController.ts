import { Request, Response } from 'express'
import InviteKeyServiceInterface from '../interfaces/InviteKeyServiceInterface'
import UserServiceInterface from '../interfaces/UserServiceInterface'

/**
 * @class InviteKeyController
 */
export default class InviteKeyController {
    /**
     * @constructor
     * @param {InviteKeyServiceInterface} inviteKeyService
     * @param {UserServiceInterface} userService
     */
    constructor(
        private inviteKeyService: InviteKeyServiceInterface,
        private userService: UserServiceInterface
    ) {}

    /**
     * Temporary.
     * Admin only endpoint.
     * Generate an invite key for a new user.
     * @param {Request} req
     * @param {Response} res
     */
    public async generate(req: Request, res: Response): Promise<void> {
        try {
            const { token, name, email } = req.query
            if (token !== process.env.ADMIN_TOKEN) {
                res.status(403).json({ error: 'Forbidden' })
                return
            }

            const user = await this.userService.create(String(name), String(email))
            const inviteKey = await this.inviteKeyService.generate(user.id)
            res.status(201).send(inviteKey)
        } catch (err) {
            console.error('[InviteKeyController] generate error:', err)
            res.status(500).json({ error: 'Internal server error.' })
        }
    }

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

