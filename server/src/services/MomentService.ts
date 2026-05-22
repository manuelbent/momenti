import OpenAI from 'openai'
import { SYSTEM_PROMPT } from '../config/constants'
import Moment from '../models/Moment'
import MomentRepositoryInterface from '../interfaces/MomentRepositoryInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'

/**
 * @class MomentService
 */
export default class MomentService implements MomentServiceInterface {
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

    /**
     * Find a moment by its slug.
     * @param {string} slug
     */
    public async getBySlug(slug: string): Promise<Moment|null> {
        return this.momentRepository.findBy('slug', slug)
    }

    /**
     * Find a published moment by its slug.
     * @param {string} slug
     * @return {Moment|null}
     */
    public async getPublishedBySlug(slug: string): Promise<Moment|null> {
        return await this.momentRepository.findPublishedBySlug(slug)
    }

    /**
     * Get all moments by user id.
     * @param {number} userId
     */
    public async getAll(userId: number): Promise<Moment[]> {
        return this.momentRepository.findManyBy('user_id', userId)
    }

    /**
     * Check if a slug already exists in the database.
     * @param {string} slug
     * @param {number} excludeId - Optional moment id to exclude from the check (useful on updates).
     */
    public async slugExists(slug: string, excludeId?: number): Promise<boolean> {
        const moment = await this.momentRepository.findBy('slug', slug)
        if (!moment) {
            return false
        }

        if (excludeId !== undefined) {
            return moment.id !== excludeId
        }

        return true
    }

    /**
     * Stream moment generation, yielding raw text chunks as they arrive from OpenAI.
     * Resolves and stores the full Moment once streaming is complete.
     * @param {string} prompt
     */
    public async* generateStream(prompt: string): AsyncGenerator<{
        chunk?: string;
        done?: boolean;
        slug?: string;
        rawMoment?: RawMoment;
        error?: string
    }> {
        const stream = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `<PROMPT>${prompt}</PROMPT>` },
            ],
            response_format: { type: 'json_object' },
            temperature: 2.0,
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

        const slug = await this.slugExists(rawMoment.slug)
            ? `${rawMoment.slug}-${Date.now()}`
            : rawMoment.slug

        yield {
            done: true,
            slug,
            rawMoment
        }
    }
}
