import { Request, Response } from 'express'
import logger from '../config/logger'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import User from '../models/User'

/**
 * @class PatchMomentController
 */
export default class PatchMomentController {
    /**
     * @constructor
     * @param {ChangeServiceInterface} changeService
     * @param {StreamWorkerInterface} streamWorker
     */
    constructor(
        private changeService: ChangeServiceInterface,
        private streamWorker: StreamWorkerInterface,
    ) {}

    /**
     * Server-Sent Events endpoint: streams a targeted patch of an existing moment.
     * @param {Request} req
     * @param {Response} res
     */
    public async handle(req: Request, res: Response): Promise<void> {
        const user: User = res.locals.user
        const momentId = Number(req.params.id)
        const { nodeId, prompt, content } = req.body

        let history: string[]
        try {
            const changes = await this.changeService.getAll(momentId)
            history = changes.map(change => change.prompt)
        } catch (err) {
            logger.error({ err }, '[PatchMomentController] Failed to load change history')
            res.status(500).json({ error: 'Internal server error.' })
            return
        }

        const emitter = this.streamWorker.patch(
            user.id,
            { nodeId, prompt, content, history },
            async data => {
                return this.changeService.store({
                    moment_id: momentId,
                    node_id: nodeId,
                    prompt,
                    old_content: content,
                    new_content: data.momentContent,
                })
            },
        )

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
