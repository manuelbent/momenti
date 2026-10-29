import { Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
import User from '../models/User'
import Moment from '../models/Moment'
import RedisService from '../services/RedisService'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'

/**
 * @class MomentGenerationController
 */
export default class MomentGenerationController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     * @param {ChangeServiceInterface} changeService
     * @param {LLMServiceInterface} llmService
     * @param {RedisService} redisService
     */
    constructor(
        private momentService: MomentServiceInterface,
        private changeService: ChangeServiceInterface,
        private llmService: LLMServiceInterface,
        private redisService: RedisService,
    ) {}

    /**
     * Server-Sent Events endpoint: streams moment generation to the client.
     * @param {Request} req
     * @param {Response} res
     */
    public async generate(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user
        const generationId: string = res.locals.generationId
        const { prompt } = req.body
        const options: GenerateMomentOptions = { heroImageUrl: res.locals.heroImageUrl }

        try {
            const progress: GenerationProgress = { stage: 'generating-moment' }
            const progressId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'progress', progress)
            emit(res, 'progress', progress, false, progressId ?? undefined)

            for await (const payload of this.llmService.generateMoment(prompt, options)) {
                if ('error' in payload) {
                    const data = { error: payload.error }
                    const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', data)
                    emit(res, 'error', data, true, eventId ?? undefined)
                    break
                }

                if ('chunk' in payload) {
                    const data = { chunk: payload.chunk }
                    const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'chunk', data)
                    emit(res, 'chunk', data, false, eventId ?? undefined)
                }

                if ('done' in payload) {
                    try {
                        const moment = await this.storeMoment(user.id, prompt, payload.momentContent)
                        const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'done', moment)
                        emit(res, 'done', moment, true, eventId ?? undefined)
                    } catch (err) {
                        logger.error({ err, userId: user.id }, '[MomentGenerationController] Store moment error')
                        const data = { error: 'Failed to save the Moment.' }
                        const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', data)
                        emit(res, 'error', data, true, eventId ?? undefined)
                    }
                    break
                }
            }
        } catch (err) {
            logger.error({ err, userId: user.id }, '[MomentGenerationController] Generation loop error')
            const data = { error: 'Failed to generate the Moment. Please try again.' }
            const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', data)
            emit(res, 'error', data, true, eventId ?? undefined)
        } finally {
            await this.redisService.releaseGenerationLock(user.id, res.locals.generationId)
        }
    }

    /**
     * Replays the user's active generation and streams subsequent events.
     * @param {Request} _
     * @param {Response} res
     */
    public async resume(_: Request, res: Response): Promise<void> {
        const user: User = res.locals.user
        try {
            for await (const { id, event, data } of this.redisService.readGenerationEvents(user.id)) {
                const end = event === 'done' || event === 'error'
                emit(res, event, data, end, id)
                if (end) {
                    return
                }
            }
        } catch (err) {
            logger.error({ err, userId: user.id }, '[MomentGenerationController] Resume stream error')
            emit(res, 'error', { error: 'Failed to resume the generation. Please try again.' }, true)
        }
    }

    /**
     * Persists a generated Moment for the given user.
     * @param {number} userId
     * @param {string} prompt - The prompt that produced the content.
     * @param {MomentContent} momentContent - Generated content, including its slug.
     * @returns {Promise<Moment>} The stored Moment.
     */
    private async storeMoment(
        userId: number,
        prompt: string,
        momentContent: MomentContent,
    ): Promise<Moment> {
        return this.momentService.store({
            user_id: userId,
            slug: momentContent.slug,
            prompt,
            content: momentContent,
        })
    }

    /**
     * Server-Sent Events endpoint: streams a targeted patch of an existing moment.
     * @param {Request} req
     * @param {Response} res
     */
    public async patch(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user
        const generationId: string = res.locals.generationId
        const momentId = Number(req.params.id)
        const { nodeId, prompt, content } = req.body

        try {
            let history: string[]
            try {
                const changes = await this.changeService.getAll(momentId)
                history = changes.map(change => change.prompt)
            } catch (err) {
                logger.error({ err }, '[MomentGenerationController] Failed to load change history')
                const data = { error: 'Internal server error.' }
                const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', data)
                emit(res, 'error', data, true, eventId ?? undefined)
                return
            }

            for await (const payload of this.llmService.patchMoment({ nodeId, prompt, content, history })) {
                if ('error' in payload) {
                    const data = { error: payload.error }
                    const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', data)
                    emit(res, 'error', data, true, eventId ?? undefined)
                    break
                }

                if ('chunk' in payload) {
                    const data = { chunk: payload.chunk }
                    const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'chunk', data)
                    emit(res, 'chunk', data, false, eventId ?? undefined)
                }

                if ('done' in payload) {
                    try {
                        const change = await this.changeService.store({
                            moment_id: momentId,
                            node_id: nodeId,
                            prompt,
                            old_content: content,
                            new_content: payload.momentContent,
                        })
                        const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'done', change)
                        emit(res, 'done', change, true, eventId ?? undefined)
                    } catch (err) {
                        logger.error({ err, userId: user.id }, '[MomentGenerationController] Patch update error')
                        const data = { error: 'Failed to save the patched Moment.' }
                        const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', data)
                        emit(res, 'error', data, true, eventId ?? undefined)
                    }
                    break
                }
            }
        } catch (err) {
            logger.error({ err, userId: user.id }, '[MomentGenerationController] Patch loop error')
            const data = { error: 'Failed to patch the Moment. Please try again.' }
            const eventId = await this.redisService.cacheGenerationEvent(user.id, generationId, 'error', data)
            emit(res, 'error', data, true, eventId ?? undefined)
        } finally {
            await this.redisService.releaseGenerationLock(user.id, res.locals.generationId)
        }
    }
}
