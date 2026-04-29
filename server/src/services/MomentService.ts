import { promises as fs } from 'fs'
import path from 'path'
import OpenAI from 'openai'
import type { Moment } from '../types/Moment'
import { SYSTEM_PROMPT } from '../config/constants'

/**
 * @class MomentService
 */
export default class MomentService {
    /**
     * The OpenAI client instance.
     * @private
     */
    private openai: OpenAI

    /**
     * @constructor
     */
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    /**
     * Persists a moment to a txt file inside the moments/ directory.
     * @param {string} prompt
     * @param {unknown} moment
     */
    private async store(prompt: string, moment: Moment): Promise<void> {
        try {
            const MOMENTS_DIR = path.resolve(process.cwd(), 'moments')
            await fs.mkdir(MOMENTS_DIR, { recursive: true })
            const filename = `${Date.now()}-${moment['slug'] ?? 'moment'}.txt`
            const content = `PROMPT\n${prompt}\n\nMOMENT\n${JSON.stringify(moment, null, 2)}\n`
            await fs.writeFile(path.join(MOMENTS_DIR, filename), content, 'utf-8')
        } catch (err) {
            console.error('[MomentService] Failed to save moment to file:', err)
        }
    }

    /**
     * Generate moment making the request to OpenAI APIs.
     * @param {string} prompt
     */
    public async generate(prompt: string): Promise<Moment> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `<PROMPT>${prompt}</PROMPT>` },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.8,
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
            throw new Error('AI returned an empty response.')
        }

        let result: Moment
        try {
            result = JSON.parse(content)
        } catch (e) {
            console.error('[MomentService] AI returned malformed JSON or was truncated:', content)
            throw new Error('Failed to generate a valid Moment structure.')
        }

        // store even if the structure is invalid
        await this.store(prompt, result)

        if (!result.slug || !result.root) {
            throw new Error('Invalid Moment structure.')
        }

        return result
    }
}
