import OpenAI from 'openai'
import type { Moment } from '../types/Moment'
import { SYSTEM_PROMPT } from '../config/constants'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'

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
    constructor(private momentRepository: MomentRepositoryInterface) {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    /**
     * Stream moment generation, yielding raw text chunks as they arrive from OpenAI.
     * Resolves and stores the full Moment once streaming is complete.
     * @param {string} prompt
     */
    public async* generateStream(prompt: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        moment?: Moment;
        error?: string
    }> {
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

        if (!moment.slug || !moment.root) {
            yield { error: 'Invalid Moment structure.' }
            return
        }

        // persist to database
        // move to dedicated function todo
        try {
            await this.momentRepository.create({
                // user_id ?
                slug: moment.slug,
                prompt,
                content: moment
            })
        } catch (err) {
            console.error('[MomentService] Failed to store moment', err)
        }

        yield {
            done: true,
            moment
        }
    }
}
