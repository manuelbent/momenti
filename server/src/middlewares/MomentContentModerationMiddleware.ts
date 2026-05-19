import { NextFunction, Request, Response } from 'express'
import OpenAI from 'openai'

/**
 * Moderates the editable content of a moment before an update is persisted.
 * @class MomentContentModerationMiddleware
 */
export default class MomentContentModerationMiddleware {
    /**
     * @private {OpenAI}
     */
    private openai: OpenAI

    /**
     * @constructor
     */
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void|Response> {
        // todo

        next()
    }
}
