import OpenAI from 'openai'
import { SYSTEM_PROMPT } from '../config/constants'
import Moment from '../models/Moment'
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
     * Persist moment to DB.
     * @param {Partial<RawMoment>} data
     */
    public async store(data: Partial<Moment>): Promise<Moment> {
        return this.momentRepository.create(data)
    }

    /**
     * Update an existing moment by id.
     * @param {number} id
     * @param {Partial<Moment>} data
     */
    public async update(id: number, data: Partial<Moment>): Promise<Moment> {
        await this.momentRepository.update(id, data)
        const moment = await this.momentRepository.findById(id)

        if (!moment) {
            throw new Error(`Moment ${id} not found after update`)
        }

        return moment
    }

    // temp function
    public async getAll(): Promise<Moment[]> {
        return this.momentRepository.findAll()
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

        let rawMoment: RawMoment
        try {
            rawMoment = JSON.parse(accumulated)
        } catch (e) {
            console.error('[MomentService] Streamed response is malformed JSON:', accumulated)
            yield { error: 'Failed to generate a valid Moment structure.' }
            return
        }

        if (!rawMoment.slug || !rawMoment.root) {
            console.error('[MomentService] Structure is invalid:', rawMoment)
            yield { error: 'Invalid Moment structure.' }
            return
        }

        const moment = await this.store({
            slug: rawMoment.slug + new Date().getTime(), // temp
            prompt,
            content: rawMoment
        })

        yield {
            done: true,
            moment
        }
    }
}
