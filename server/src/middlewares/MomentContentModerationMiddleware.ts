import { NextFunction, Request, Response } from 'express'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import { parse } from '../utils/momentContentParser'
import logger from '../config/logger'

/**
 * Blocks harmful text added through the Moment editor.
 * @class MomentContentModerationMiddleware
 */
export default class MomentContentModerationMiddleware {
    constructor(private llmService: LLMServiceInterface) {}

    public async handle(req: Request, res: Response, next: NextFunction): Promise<void|Response> {
        const { content } = req.body

        if (!content) {
            next()
            return
        }

        try {
            const text = parse(content)
            const flagged = await this.llmService.moderateText(text)

            if (flagged) {
                return res.status(422).json({
                    error: 'Your Moment contains harmful or prohibited content and cannot be saved.',
                })
            }
        } catch (err) {
            logger.error({ err }, '[MomentContentModerationMiddleware] Content moderation error')
            return res.status(503).json({
                error: 'Failed to review your Moment. Please try again.',
            })
        }

        next()
    }
}
