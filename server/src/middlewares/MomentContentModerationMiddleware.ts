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

        const text = parse(content)

        logger.info(text)

        const flagged = await this.llmService.moderateText(text)

        if (flagged) {
            return res.status(422).json({ error: 'Your Moment contains harmful or prohibited content and cannot be saved.' })
        }

        next()
    }
}
