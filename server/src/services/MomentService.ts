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
     * Stream moment generation, yielding raw text chunks as they arrive from OpenAI.
     * Resolves and stores the full Moment once streaming is complete.
     * @param {string} prompt
     */
    public async *generateStream(prompt: string): AsyncGenerator<{ chunk?: string; done?: boolean; moment?: Moment; error?: string }> {
        const stream = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `<PROMPT>${prompt}</PROMPT>` },
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

        let moment: Moment
        try {
            moment = JSON.parse(accumulated)
        } catch (e) {
            console.error('[MomentService] Streamed response is malformed JSON:', accumulated)
            yield { error: 'Failed to generate a valid Moment structure.' }
            return
        }

        // store the output
        await this.store(prompt, moment)

        if (!moment.slug || !moment.root) {
            yield { error: 'Invalid Moment structure.' }
            return
        }

        yield { done: true, moment }
    }
}
