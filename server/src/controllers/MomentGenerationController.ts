import { Request, Response } from 'express'
import { emit } from '../utils/sse'
import logger from '../config/logger'
import User from '../models/User'
import Moment from '../models/Moment'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import StreamCacheInterface from '../interfaces/StreamCacheInterface'

/**
 * @class MomentGenerationController
 */
export default class MomentGenerationController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     * @param {ChangeServiceInterface} changeService
     * @param {LLMServiceInterface} llmService
     * @param {StreamCacheInterface} streamCache
     */
    constructor(
        private momentService: MomentServiceInterface,
        private changeService: ChangeServiceInterface,
        private llmService: LLMServiceInterface,
        private streamCache: StreamCacheInterface,
    ) {}

    /**
     * Server-Sent Events endpoint: streams moment generation to the client.
     * @param {Request} req
     * @param {Response} res
     */
    public async capture(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user
        const { prompt } = req.body
        const options: CaptureMomentOptions = { heroImageUrl: res.locals.heroImageUrl }

        this.streamCache.init(user.id)
        try {
            this.send(res, 'progress', { stage: 'generating-moment' })
            for await (const payload of this.llmService.captureMoment(prompt, options)) {
                if ('error' in payload) {
                    this.send(res, 'error', { error: payload.error }, true)
                    break
                }

                if ('chunk' in payload) {
                    this.send(res, 'chunk', { chunk: payload.chunk })
                }

                if ('done' in payload) {
                    try {
                        const moment = await this.storeCapture(user.id, prompt, payload.momentContent)
                        this.send(res, 'done', moment, true)
                    } catch (err) {
                        logger.error({ err, userId: user.id }, '[MomentGenerationController] Store moment error')
                        this.send(res, 'error', { error: 'Failed to save the Moment.' }, true)
                    }
                    break
                }
            }
        } catch (err) {
            logger.error({ err, userId: user.id }, '[MomentGenerationController] Generation loop error')
            this.send(res, 'error', { error: 'Failed to generate the Moment. Please try again.' }, true)
        } finally {
            this.streamCache.clear(user.id)
        }
    }

    private async storeCapture(
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
        const momentId = Number(req.params.id)
        const { nodeId, prompt, content } = req.body

        let history: string[]
        try {
            const changes = await this.changeService.getAll(momentId)
            history = changes.map(change => change.prompt)
        } catch (err) {
            logger.error({ err }, '[MomentGenerationController] Failed to load change history')
            this.send(res, 'error', { error: 'Internal server error.' }, true)
            return
        }

        this.streamCache.init(user.id)

        try {
            for await (const payload of this.llmService.patchMoment({ nodeId, prompt, content, history })) {
                if ('error' in payload) {
                    this.send(res, 'error', { error: payload.error }, true)
                    break
                }

                if ('chunk' in payload) {
                    this.send(res, 'chunk', { chunk: payload.chunk })
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
                        this.send(res, 'done', change, true)
                    } catch (err) {
                        logger.error({ err, userId: user.id }, '[MomentGenerationController] Patch update error')
                        this.send(res, 'error', { error: 'Failed to save the patched Moment.' }, true)
                    }
                    break
                }
            }
        } catch (err) {
            logger.error({ err, userId: user.id }, '[MomentGenerationController] Patch loop error')
            this.send(res, 'error', { error: 'Failed to patch the Moment. Please try again.' }, true)
        } finally {
            this.streamCache.clear(user.id)
        }
    }

    private send(res: Response, event: string, data: unknown, end = false): void {
        if (!res.destroyed && !res.writableEnded) {
            emit(res, event, data, end)
        }
    }
}
