import { NextFunction, Request, Response } from 'express'

/**
 * Strips prompt-injection attempts from user input before it reaches the LLM.
 *
 * The LLM pipeline embeds the raw user prompt inside structural control tags
 * (e.g. `<PROMPT>`, `<CHANGE>`, `<CURRENT_CONTENT>`) that delimit trusted
 * instructions from untrusted user text. A malicious user could inject those
 * same tags to escape their delimited section and smuggle instructions into
 * the model. This middleware neutralizes every occurrence of those control
 * tags in the incoming `prompt` field so they can no longer act as delimiters.
 * @class PromptSanitizeMiddleware
 */
export default class PromptSanitizeMiddleware {
    /**
     * Structural control tags used by the LLMService to delimit trusted
     * instructions from untrusted user input. Kept in sync with LLMService.
     * @private
     * @readonly
     */
    private static readonly CONTROL_TAGS = [
        'PROMPT',
        'CURRENT_CONTENT',
        'CHANGE',
        'TARGET_NODE_ID',
        'CHANGE_HISTORY',
        'ART_DIRECTION',
    ]

    /**
     * Matches an opening or closing control tag (case-insensitive), tolerating
     * surrounding whitespace inside the angle brackets, e.g. `<PROMPT>`,
     * `</ PROMPT >`.
     * @private
     * @readonly
     */
    private static readonly CONTROL_TAG_PATTERN = new RegExp(
        `<\\s*/?\\s*(?:${PromptSanitizeMiddleware.CONTROL_TAGS.join('|')})\\s*>`,
        'gi',
    )

    /**
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    public handle(req: Request, res: Response, next: NextFunction): void {
        const { prompt } = req.body

        if (typeof prompt === 'string') {
            req.body.prompt = this.sanitize(prompt)
        }

        next()
    }

    /**
     * Removes every structural control tag from the given text.
     * @param {string} value - The raw user prompt.
     * @returns {string} The sanitized prompt with control tags stripped.
     * @private
     */
    private sanitize(value: string): string {
        return value.replace(PromptSanitizeMiddleware.CONTROL_TAG_PATTERN, '')
    }
}
