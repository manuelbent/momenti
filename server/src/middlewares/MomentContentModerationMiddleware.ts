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
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
        const { slug, content } = req.body

        // nothing to moderate
        if (!content || !slug) {
            return next()
        }

        let flagged: boolean

        try {
            const moderation = await this.openai.moderations.create({
                model: 'omni-moderation-latest',
                input: `slug: ${slug}, content: ${JSON.stringify(content)}`,
            })

            flagged = moderation.results[0].flagged

            console.log(flagged)
        } catch (e) {
            // Fail open: if the moderation API is unavailable let the request
            // continue so that the update can still be persisted.
            return next()
        }

        if (flagged) {
            return res.status(422).json({
                error: 'The content contains harmful or prohibited material and cannot be saved.',
            })
        }

        next()
    }
}
