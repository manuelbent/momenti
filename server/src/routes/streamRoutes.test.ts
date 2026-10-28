import express, { NextFunction, Request, Response } from 'express'
import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ioc from '../config/ioc'
import MomentGenerationController from '../controllers/MomentGenerationController'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import GenerationGuardMiddleware from '../middlewares/GenerationGuardMiddleware'
import PromptModerationMiddleware from '../middlewares/PromptModerationMiddleware'
import SseMiddleware from '../middlewares/SseMiddleware'
import StreamCacheService from '../services/StreamCacheService'
import StreamWorker from '../workers/StreamWorker'
import router from './router'

vi.mock('../config/ioc', () => ({
    default: {
        systemController: {
            healthcheck: (_req: Request, res: Response) => res.sendStatus(200),
            notFound: (_req: Request, res: Response) => res.sendStatus(404),
        },
    },
}))

describe('generation SSE routes', () => {
    const userId = 7
    const content: MomentContent = {
        slug: 'garden',
        root: { id: 'root', type: 'box' },
    }
    const moment = { id: 12, content }
    const change = { id: 3, moment_id: 12, new_content: content }
    const captureOptions = { heroImageUrl: 'https://images.example/hero.png' }
    const next = (_req: Request, _res: Response, next: NextFunction) => next()
    let app: express.Express
    let cache: StreamCacheService
    let worker: StreamWorker
    let moderateText: ReturnType<typeof vi.fn>
    let captureMoment: ReturnType<typeof vi.fn>
    let patchMoment: ReturnType<typeof vi.fn>
    let getAll: ReturnType<typeof vi.fn>

    beforeEach(() => {
        moderateText = vi.fn().mockResolvedValue(false)
        captureMoment = vi.fn(async function* () {
            yield { chunk: '{"slug":"garden"}' }
            yield { done: true, momentContent: content }
        })
        patchMoment = vi.fn(async function* () {
            yield { chunk: '{"slug":"garden"}' }
            yield { done: true, momentContent: content }
        })
        getAll = vi.fn().mockResolvedValue([{ prompt: 'Make it green' }])
        const llm = { moderateText, captureMoment, patchMoment } as unknown as LLMServiceInterface
        cache = new StreamCacheService()
        worker = new StreamWorker(llm, cache)
        const controller = new MomentGenerationController(
            { store: vi.fn().mockResolvedValue(moment) } as unknown as MomentServiceInterface,
            { getAll, store: vi.fn().mockResolvedValue(change) } as unknown as ChangeServiceInterface,
            worker,
        )

        Object.assign(ioc, {
            inviteKeyMiddleware: {
                handle: (_req: Request, res: Response, next: NextFunction) => {
                    res.locals.user = { id: userId }
                    next()
                },
            },
            momentOwnerShipMiddleware: { handle: next },
            changeLimitMiddleware: { handle: next },
            generationGuardMiddleware: new GenerationGuardMiddleware(cache),
            patchMomentRequestValidator: { validate: next },
            promptSanitizeMiddleware: { handle: next },
            promptModerationMiddleware: new PromptModerationMiddleware(llm),
            sseMiddleware: new SseMiddleware(),
            momentGenerationController: controller,
        })
        app = express()
        app.use(express.json())
        app.use(router)
    })

    afterEach(() => {
        cache.clear(userId)
    })

    const patchBody = { prompt: 'Make it brighter', content }

    it('opens SSE before PATCH moderation and streams the saved change', async () => {
        const response = await request(app).patch('/moments/12').send(patchBody).timeout(2000)

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toBe('text/event-stream')
        expect(response.text).toBe(
            'event: progress\ndata: {"stage":"moderating"}\n\n'
            + 'event: chunk\ndata: {"chunk":"{\\"slug\\":\\"garden\\"}"}\n\n'
            + `event: done\ndata: ${JSON.stringify(change)}\n\n`,
        )
        expect(patchMoment).toHaveBeenCalledWith({
            ...patchBody,
            nodeId: undefined,
            history: ['Make it green'],
        })
    })

    it('keeps pre-stream generation guard failures as HTTP errors', async () => {
        cache.init(userId, 'capture')
        const response = await request(app).patch('/moments/12').send(patchBody)

        expect(response.status).toBe(409)
        expect(response.body.error).toBe('A generation is already in progress.')
        expect(moderateText).not.toHaveBeenCalled()
    })

    it('streams moderation rejection without starting a patch', async () => {
        moderateText.mockResolvedValue(true)
        const response = await request(app).patch('/moments/12').send(patchBody).timeout(2000)

        expect(response.headers['content-type']).toBe('text/event-stream')
        expect(response.text).toContain('event: error\n')
        expect(response.text).toContain('Your message contains harmful or prohibited content')
        expect(patchMoment).not.toHaveBeenCalled()
    })

    it('streams change-history failures instead of sending JSON after headers', async () => {
        getAll.mockRejectedValue(new Error('Database unavailable'))
        const response = await request(app).patch('/moments/12').send(patchBody).timeout(2000)

        expect(response.status).toBe(200)
        expect(response.text).toContain('event: error\ndata: {"error":"Internal server error."}\n\n')
        expect(patchMoment).not.toHaveBeenCalled()
    })

    it('streams patch generation failures and releases the generation guard', async () => {
        patchMoment.mockImplementation(async function* () {
            yield { error: 'Patch failed.' }
        })
        const response = await request(app).patch('/moments/12').send(patchBody).timeout(2000)

        expect(response.text).toContain('event: error\ndata: {"error":"Patch failed."}\n\n')
        expect(worker.isGenerating(userId)).toBe(false)
    })

    it('returns an idle SSE event when no capture exists', async () => {
        const response = await request(app).get('/capture/resume').timeout(2000)

        expect(response.headers['content-type']).toBe('text/event-stream')
        expect(response.text).toBe('event: idle\ndata: {}\n\n')
    })

    it('does not resume a patch as a capture', async () => {
        cache.init(userId, 'patch')
        const response = await request(app).get('/capture/resume').timeout(2000)

        expect(response.text).toBe('event: idle\ndata: {}\n\n')
    })

    it('replays completed captures including their saved moment', async () => {
        worker.capture(userId, 'Garden page', captureOptions, async () => moment)
        await vi.waitFor(() => expect(worker.isGenerating(userId)).toBe(false))

        const response = await request(app).get('/capture/resume').timeout(2000)

        expect(response.text).toBe(
            'event: chunk\ndata: {"chunk":"{\\"slug\\":\\"garden\\"}"}\n\n'
            + `event: done\ndata: ${JSON.stringify(moment)}\n\n`,
        )
    })

    it('replays capture errors and closes the response', async () => {
        captureMoment.mockImplementation(async function* () {
            yield { error: 'Capture failed.' }
        })
        worker.capture(userId, 'Garden page', captureOptions, async () => moment)
        await vi.waitFor(() => expect(worker.isGenerating(userId)).toBe(false))

        const response = await request(app).get('/capture/resume').timeout(2000)

        expect(response.text).toBe('event: error\ndata: {"error":"Capture failed."}\n\n')
    })

    it('replays buffered events then keeps GET connected for live events', async () => {
        let release!: () => void
        const gate = new Promise<void>(resolve => { release = resolve })
        captureMoment.mockImplementation(async function* () {
            yield { chunk: 'buffered' }
            await gate
            yield { chunk: 'live' }
            yield { done: true, momentContent: content }
        })
        const emitter = worker.capture(userId, 'Garden page', captureOptions, async () => moment)
        await vi.waitFor(() => expect(worker.getBufferedEvents(userId)).toHaveLength(1))
        const responsePromise = request(app).get('/capture/resume').timeout(2000).then(res => res)
        try {
            await vi.waitFor(() => expect(emitter.listenerCount('chunk')).toBe(1))
        } finally {
            release()
        }
        const response = await responsePromise

        expect(response.text).toBe(
            'event: chunk\ndata: {"chunk":"buffered"}\n\n'
            + 'event: chunk\ndata: {"chunk":"live"}\n\n'
            + `event: done\ndata: ${JSON.stringify(moment)}\n\n`,
        )
        expect(emitter.listenerCount('chunk')).toBe(0)
        expect(emitter.listenerCount('done')).toBe(0)
        expect(emitter.listenerCount('stream-error')).toBe(0)
    })
})
