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
            _heroImageUrl: string,
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
            'https://images.example/hero.png',
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
