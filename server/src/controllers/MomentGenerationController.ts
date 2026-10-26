import { Request, Response } from 'express'
import { EventEmitter } from 'node:events'
import logger from '../config/logger'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import R2ServiceInterface from '../interfaces/R2ServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import Moment from '../models/Moment'
import User from '../models/User'
import { findGeneratedHeroImage } from '../utils/heroImage'

/**
 * @class MomentGenerationController
 */
export default class MomentGenerationController {
    /**
     * @constructor
     * @param {MomentServiceInterface} momentService
     * @param {ChangeServiceInterface} changeService
     * @param {StreamWorkerInterface} streamWorker
     * @param {ImageServiceInterface} imageService
     * @param {R2ServiceInterface} r2Service
     */
    constructor(
        private momentService: MomentServiceInterface,
        private changeService: ChangeServiceInterface,
        private streamWorker: StreamWorkerInterface,
        private imageService: ImageServiceInterface,
        private r2Service: R2ServiceInterface,
    ) {}

    /**
     * Server-Sent Events endpoint: streams moment generation to the client.
     * @param {Request} req
     * @param {Response} res
     */
    public capture(req: Request, res: Response): void {
        const user: User = res.locals.user
        const { prompt } = req.body

        const emitter = this.streamWorker.capture(
            user.id,
            prompt,
            ({ prompt, momentContent }) => this.storeCapture(user.id, prompt, momentContent),
        )

        this.stream(req, res, emitter)
    }

    private async storeCapture(
        userId: number,
        prompt: string,
        momentContent: MomentContent,
    ): Promise<unknown> {
        const moment = await this.momentService.store({
            user_id: userId,
            slug: momentContent.slug,
            prompt,
            content: momentContent,
        })

        const imageNode = findGeneratedHeroImage(momentContent.root)
        if (!imageNode?.generationPrompt) {
            return moment
        }

        return this.generateHeroImage(
            moment,
            momentContent,
            imageNode,
            imageNode.generationPrompt,
        )
    }

    private async generateHeroImage(
        moment: Moment,
        momentContent: MomentContent,
        imageNode: MomentNode,
        generationPrompt: string,
    ): Promise<Moment> {
        const buffer = await this.imageService.generate(generationPrompt)
        const url = await this.r2Service.upload(buffer, 'image/png', 'generated.png')

        await this.imageService.store({
            url,
            type: 'generated',
            moment_id: moment.id,
            moment_node_id: imageNode.id,
            purpose: 'hero',
            prompt: generationPrompt,
        })

        imageNode.src = url
        return this.momentService.update(moment.id, { content: momentContent })
    }

    /**
     * Server-Sent Events endpoint: resumes a capture stream for the current user.
     * @param {Request} req
     * @param {Response} res
     */
    public resume(req: Request, res: Response): void {
        const user: User = res.locals.user

        if (!this.streamWorker.hasCapture(user.id)) {
            res.write('event: idle\n')
            res.write('data: {}\n\n')
            res.end()
            return
        }

        const events = this.streamWorker.getBufferedEvents(user.id)
        for (const event of events) {
            res.write(`event: ${event.event}\n`)
            res.write(`data: ${JSON.stringify(event.data)}\n\n`)
        }

        if (!this.streamWorker.isGenerating(user.id)) {
            res.end()
            return
        }

        this.stream(req, res, this.streamWorker.getEmitter(user.id)!)
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
            res.status(500).json({ error: 'Internal server error.' })
            return
        }

        const emitter = this.streamWorker.patch(
            user.id,
            { nodeId, prompt, content, history },
            async ({ momentContent }) => {
                return this.changeService.store({
                    moment_id: momentId,
                    node_id: nodeId,
                    prompt,
                    old_content: content,
                    new_content: momentContent,
                })
            },
        )

        this.stream(req, res, emitter)
    }

    private stream(req: Request, res: Response, emitter: EventEmitter): void {
        const onChunk = (data: { chunk: string }) => {
            res.write('event: chunk\n')
            res.write(`data: ${JSON.stringify(data)}\n\n`)
        }
        const onDone = (data: unknown) => {
            res.write('event: done\n')
            res.write(`data: ${JSON.stringify(data)}\n\n`)
            res.end()
        }
        const onError = (data: { error: string }) => {
            res.write('event: error\n')
            res.write(`data: ${JSON.stringify(data)}\n\n`)
            res.end()
        }

        emitter.on('chunk', onChunk)
        emitter.once('done', onDone)
        emitter.once('stream-error', onError)

        req.once('close', () => {
            emitter.off('chunk', onChunk)
            emitter.off('done', onDone)
            emitter.off('stream-error', onError)
        })
    }
}
