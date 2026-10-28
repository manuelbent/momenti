import { EventEmitter } from 'node:events'
import { Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import StreamWorkerInterface from '../interfaces/StreamWorkerInterface'
import Moment from '../models/Moment'
import MomentGenerationController from './MomentGenerationController'

describe('MomentGenerationController capture completion', () => {
    const userId = 7
    const prompt = 'Create a garden wedding page'
    const storedMoment = {
        id: 12,
        slug: 'garden-wedding',
    } as unknown as Moment
    let completion: (data: {
        prompt: string
        momentContent: MomentContent
    }) => Promise<unknown>
    let storeMoment: ReturnType<typeof vi.fn>
    let capture: ReturnType<typeof vi.fn>
    let controller: MomentGenerationController

    beforeEach(() => {
        storeMoment = vi.fn().mockResolvedValue(storedMoment)

        const momentService = {
            store: storeMoment,
        } as unknown as MomentServiceInterface
        const changeService = {} as ChangeServiceInterface
        capture = vi.fn((
            _userId: number,
            _prompt: string,
            _options: CaptureMomentOptions,
            onDone: typeof completion,
        ) => {
            completion = onDone
            return new EventEmitter()
        })
        const streamWorker = {
            capture,
        } as unknown as StreamWorkerInterface

        controller = new MomentGenerationController(
            momentService,
            changeService,
            streamWorker,
        )

        const req = {
            body: { prompt },
            once: vi.fn(),
        } as unknown as Request
        const res = {
            locals: {
                user: { id: userId },
                heroImageUrl: 'https://images.example/hero.png',
            },
            write: vi.fn(),
            end: vi.fn(),
            once: vi.fn(),
        } as unknown as Response

        controller.capture(req, res)
    })

    it('passes the hero image URL to generation and stores the moment', async () => {
        const content: MomentContent = {
            slug: 'garden-wedding',
            root: { id: 'root', type: 'box' },
        }

        await expect(completion({ prompt, momentContent: content })).resolves.toBe(storedMoment)
        expect(capture).toHaveBeenCalledWith(
            userId,
            prompt,
            { heroImageUrl: 'https://images.example/hero.png' },
            expect.any(Function),
        )
        expect(storeMoment).toHaveBeenCalledWith({
            user_id: userId,
            slug: content.slug,
            prompt,
            content,
        })
    })
})

describe('MomentGenerationController stream lifecycle', () => {
    it('detaches a resumed client only when its response closes', () => {
        const emitter = new EventEmitter()
        const controller = new MomentGenerationController(
            {} as MomentServiceInterface,
            {} as ChangeServiceInterface,
            {
                hasCapture: () => true,
                getBufferedEvents: () => [],
                isGenerating: () => true,
                getEmitter: () => emitter,
            } as unknown as StreamWorkerInterface,
        )
        const req = new EventEmitter()
        const res = Object.assign(new EventEmitter(), {
            locals: { user: { id: 7 } },
            write: vi.fn(),
            end: vi.fn(),
        })

        controller.resume(req as Request, res as unknown as Response)
        req.emit('close')
        emitter.emit('chunk', { chunk: 'still connected' })
        expect(res.write).toHaveBeenCalledWith('data: {"chunk":"still connected"}\n\n')

        res.emit('close')
        expect(emitter.listenerCount('chunk')).toBe(0)
        expect(emitter.listenerCount('done')).toBe(0)
        expect(emitter.listenerCount('stream-error')).toBe(0)
        res.write.mockClear()
        emitter.emit('chunk', { chunk: 'after disconnect' })
        expect(res.write).not.toHaveBeenCalled()
    })
})
