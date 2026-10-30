import { NextFunction, Request, Response } from 'express'
import logger from '../config/logger'
import { parse } from '../utils/momentContentParser'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

/**
 * Blocks harmful text added through the Moment editor.
 * @class MomentContentModerationMiddleware
 */
export default class MomentContentModerationMiddleware {
    /**
     * @constructor
     * @param {LLMServiceInterface} llmService
     */
    constructor(private llmService: LLMServiceInterface) {}

    /**
     * Moderates editor content, rejecting flagged text with 422 or processing errors with 503.
     * Requests without content continue without moderation.
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {Promise<void|Response>}
     */
    public async handle(req: Request, res: Response, next: NextFunction): Promise<void|Response> {
        const { content } = req.body

        if (!content) {
            next()
            return
        }

        const context: LLMRequestContext = {
            userId: res.locals.user.id,
            momentId: Number(req.params.id),
            operation: 'moment-content-moderation',
        }

        try {
            const text = parse(content)
            const flagged = await this.llmService.moderateText(text, context)

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
