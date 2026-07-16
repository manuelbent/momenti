import { readFileSync } from 'fs'
import { join } from 'path'
import OpenAI from 'openai'
import { z } from 'zod'
import logger from '../config/logger'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

const artDirectionSchema = z.object({
    mood: z.string().min(1),
    narrative: z.string().min(1),
    composition: z.string().min(1),
    focalPoint: z.string().min(1),
    typography: z.string().min(1),
    palette: z.string().min(1),
    imageTreatment: z.string().min(1),
    motion: z.string().min(1),
    mobileInterpretation: z.string().min(1),
    distinctiveMove: z.string().min(1),
    avoid: z.array(z.string().min(1)).min(2).max(6),
})

/**
 * Service responsible for all LLM interactions.
 * Orchestrates the AI pipeline: prompt moderation → moment generation
 * @class LLMService
 * @implements {LLMServiceInterface}
 */
export default class LLMService implements LLMServiceInterface {
    private hasValidNodeIds(root: MomentNode): boolean {
        const seen = new Set<string>()
        const stack = [root]

        while (stack.length > 0) {
            const node = stack.pop()!
            if (typeof node.id !== 'string' || !node.id.trim() || seen.has(node.id)) {
                return false
            }
            seen.add(node.id)
            stack.push(...(node.children ?? []))
        }

        return true
    }

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
     * System prompt for the creative art-direction pass.
     * @private
     */
    private readonly artDirectionPrompt: string

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
        this.artDirectionPrompt = readFileSync(join(join(__dirname, 'prompts'), 'art-direction-prompt.txt'), 'utf-8')
        this.capturePrompt = readFileSync(join(join(__dirname, 'prompts'), 'capture-prompt.txt'), 'utf-8')
        this.patchPrompt = readFileSync(join(join(__dirname, 'prompts'), 'patch-prompt.txt'), 'utf-8')
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
            logger.error('[LLMService] classifyPrompt: malformed JSON response')
            return { valid: false, reason: 'Classification failed.' }
        }
    }

    /**
     * @param {string} prompt
     */
    public async* captureMoment(prompt: string): AsyncGenerator<{
        phase?: 'art' | 'capture';
        chunk?: string;
        done?: boolean;
        momentContent?: MomentContent;
        error?: string;
    }> {
        const artStream = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: this.artDirectionPrompt },
                { role: 'user', content: `<PROMPT>${prompt.trim()}</PROMPT>` },
            ],
            response_format: { type: 'json_object' },
            temperature: 1.15,
            stream: true,
        })

        let artRaw = ''

        for await (const part of artStream) {
            const delta = part.choices[0]?.delta?.content ?? ''
            if (delta) {
                artRaw += delta
                yield { phase: 'art', chunk: delta }
            }
        }

        let artDirection: z.infer<typeof artDirectionSchema>
        try {
            const { data, success, error } = artDirectionSchema.safeParse(JSON.parse(artRaw))
            if (!success) {
                logger.error({ issues: error.issues }, '[LLMService] createArtDirection: invalid response')
                yield { error: 'Invalid art direction response.' }
                return
            }
            artDirection = data
        } catch {
            logger.error({ artRaw }, '[LLMService] createArtDirection: malformed or invalid response')
            throw new Error('Invalid art direction response.')
        }

        const stream = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: this.capturePrompt },
                {
                    role: 'user',
                    content:
                        `<PROMPT>${prompt.trim()}</PROMPT>\n` +
                        `<ART_DIRECTION>${JSON.stringify(artDirection)}</ART_DIRECTION>`,
                },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.95,
            stream: true,
        })

        let accumulated = ''

        for await (const part of stream) {
            const delta = part.choices[0]?.delta?.content ?? ''
            if (delta) {
                accumulated += delta
                yield { phase: 'capture', chunk: delta }
            }
        }

        try {
            const parsed: MomentContent = JSON.parse(accumulated)
            if (!parsed.slug || !parsed.root || !this.hasValidNodeIds(parsed.root)) {
                logger.error({ momentContent: parsed }, '[LLMService] captureMoment: invalid moment structure')
                yield { error: 'Invalid Moment structure.' }
                return
            }

            yield { done: true, momentContent: parsed }
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
            const parsed: MomentContent = JSON.parse(accumulated)
            if (!parsed.slug || !parsed.root || !this.hasValidNodeIds(parsed.root)) {
                logger.error({ momentContent: parsed }, '[LLMService] patchMoment: invalid moment structure')
                yield { error: 'Invalid Moment structure.' }
                return
            }

            yield { done: true, momentContent: parsed }
        } catch {
            logger.error({ accumulated }, '[LLMService] patchMoment: malformed JSON')
            yield { error: 'Failed to generate a valid Moment.' }
        }
    }
}
