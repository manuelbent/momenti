import { readFileSync } from 'fs'
import { join } from 'path'
import OpenAI from 'openai'
import logger from '../config/logger'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

/**
 * Service responsible for all LLM interactions.
 * Orchestrates the AI pipeline: prompt moderation → moment generation
 * @class LLMService
 * @implements {LLMServiceInterface}
 */
export default class LLMService implements LLMServiceInterface {
    /**
     * System prompt for the classifier model.
     * Loaded once at instance creation from `prompts/classifier-prompt.txt`.
     * @private
     */
    private readonly classifierPrompt: string

    /**
     * Capture system prompt for the Art Director model.
     * Loaded once at instance creation from `prompts/capture-prompt.txt`.
     * @private
     */
    private readonly capturePrompt: string

    /**
     * Patch system prompt for the Art Director model.
     * Loaded once at instance creation from `prompts/patch-prompt.txt`.
     * @private
     */
    private readonly patchPrompt: string

    /**
     * The OpenAI client instance.
     * @private
     */
    private openai: OpenAI

    /**
     * Initializes the service, reads all prompt files from disk, and creates
     * an OpenAI client using the `OPENAI_API_KEY` environment variable.
     * @constructor
     */
    constructor() {
        this.classifierPrompt = readFileSync(join(join(__dirname, 'prompts'), 'classifier-prompt.txt'), 'utf-8')
        this.capturePrompt = readFileSync(join(join(__dirname, 'prompts'), 'capture-prompt.txt'), 'utf-8')
        this.patchPrompt = readFileSync(join(join(__dirname, 'prompts'), 'patch-prompt.txt'), 'utf-8')
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    /**
     * Check whether the given text contains harmful or prohibited content.
     * @param {string} text - The text to moderate.
     * @returns {Promise<boolean>} `true` if flagged, `false` otherwise.
     */
    public async moderateText(text: string): Promise<boolean> {
        try {
            const moderation = await this.openai.moderations.create({
                model: 'omni-moderation-latest',
                input: text,
            })
            return moderation.results[0].flagged
        } catch {
            // fail open: treat as not flagged if the moderation API is unavailable
            return false
        }
    }

    /**
     * @param {string} prompt
     */
    public async classifyPrompt(prompt: string): Promise<{ valid: boolean; reason?: string }> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4.1-mini',
            messages: [
                { role: 'system', content: this.classifierPrompt },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0,
        })

        try {
            return JSON.parse(response.choices[0].message.content ?? '{}')
        } catch {
            logger.error('[LLMService] classifyPrompt: malformed JSON response')
            return { valid: false, reason: 'Classification failed.' }
        }
    }

    /**
     * @param {string} prompt
     */
    public async* captureMoment(prompt: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }> {
        const stream = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: this.capturePrompt },
                { role: 'user', content: `<PROMPT>${prompt.trim()}</PROMPT>` },
            ],
            response_format: { type: 'json_object' },
            temperature: 1.2,
            stream: true,
        })

        let accumulated = ''

        for await (const part of stream) {
            const delta = part.choices[0]?.delta?.content ?? ''
            if (delta) {
                accumulated += delta
                yield { chunk: delta }
            }
        }

        try {
            const momentContent: MomentContent = JSON.parse(accumulated)
            if (!momentContent.slug || !momentContent.root) {
                logger.error({ momentContent }, '[LLMService] captureMoment: invalid moment structure')
                yield { error: 'Invalid Moment structure.' }
                return
            }

            yield { done: true, momentContent }
        } catch {
            logger.error({ accumulated }, '[LLMService] captureMoment: malformed JSON')
            yield { error: 'Failed to generate a valid Moment.' }
        }
    }

    /**
     * Streams a targeted patch of an existing MomentContent.
     * The LLM receives:
     * - the user's plain-language instruction,
     * - the full current content,
     * - optional id of the node to change,
     * - optional history of previous change prompts (for vague follow-ups),
     * then returns the full updated MomentContent.
     * @param {PatchMomentParams} params - The patch parameters.
     */
    public async* patchMoment(params: PatchMomentParams): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }> {
        const { prompt, content, nodeId, history } = params

        // only the prior prompt strings are sent (no prior contents) to keep token usage low

        const userMessage =
            `<CURRENT_CONTENT>${JSON.stringify(content)}</CURRENT_CONTENT>\n` +
            `<CHANGE>${prompt.trim()}</CHANGE>\n` +
            (nodeId ?
                    `<TARGET_NODE_ID>${nodeId}</TARGET_NODE_ID>\n` :
                    ''
            ) +
            ((history && history.length) ?
                    `<CHANGE_HISTORY>\n${history.map((p, i) => `${i + 1}. ${p.trim()}`).join('\n')}\n</CHANGE_HISTORY>\n` :
                    ''
            )

        const stream = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: this.patchPrompt },
                { role: 'user', content: userMessage },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.8,
            stream: true,
        })

        let accumulated = ''

        for await (const part of stream) {
            const delta = part.choices[0]?.delta?.content ?? ''
            if (delta) {
                accumulated += delta
                yield { chunk: delta }
            }
        }

        try {
            const momentContent: MomentContent = JSON.parse(accumulated)
            if (!momentContent.slug || !momentContent.root) {
                logger.error({ momentContent }, '[LLMService] patchMoment: invalid moment structure')
                yield { error: 'Invalid Moment structure.' }
                return
            }

            yield { done: true, momentContent }
        } catch {
            logger.error({ accumulated }, '[LLMService] patchMoment: malformed JSON')
            yield { error: 'Failed to generate a valid Moment.' }
        }
    }
}
