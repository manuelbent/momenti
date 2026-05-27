import { readFileSync } from 'fs'
import { join } from 'path'
import OpenAI from 'openai'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

/**
 * Service responsible for all LLM interactions.
 * Orchestrates the AI pipeline: prompt moderation → moment generation
 * @class LLMService
 * @implements {LLMServiceInterface}
 */
export default class LLMService implements LLMServiceInterface {
    /**
     * @private
     */
    private readonly classifierPrompt: string

    /**
     * System prompt for the Art Director model.
     * Loaded once at instance creation from `prompts/copywriter.txt`.
     * @private
     */
    private readonly systemPrompt: string

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
        this.systemPrompt = readFileSync(join(join(__dirname, 'prompts'), 'system-prompt.txt'), 'utf-8')
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    /**
     * Check whether the given prompt contains harmful or prohibited content.
     * Returns `true` if the prompt is flagged, `false` otherwise.
     * Fails open (returns `false`) if the Moderation API is unavailable.
     * @param {string} prompt - The raw user prompt to moderate.
     * @returns {Promise<boolean>} `true` if flagged, `false` if safe or API is down.
     */
    public async moderatePrompt(prompt: string): Promise<boolean> {
        try {
            const moderation = await this.openai.moderations.create({
                model: 'omni-moderation-latest',
                input: prompt,
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
            console.error('[LLMService] classifyPrompt: malformed JSON response')
            return { valid: false, reason: 'Classification failed.' }
        }
    }

    /**
     * @param {string} prompt
     */
    public async* streamMoment(prompt: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }> {
        const stream = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: this.systemPrompt },
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
                console.error('[LLMService] streamMoment: invalid moment structure:', momentContent)
                yield { error: 'Invalid Moment structure.' }
                return
            }

            yield { done: true, momentContent }
        } catch {
            console.error('[LLMService] streamMoment: malformed JSON:', accumulated)
            yield { error: 'Failed to generate a valid Moment.' }
        }
    }
}
