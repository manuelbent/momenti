import { beforeEach, describe, expect, it, vi } from 'vitest'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import StreamCacheService from '../services/StreamCacheService'
import StreamWorker from './StreamWorker'
import type Moment from '../models/Moment'
import type Change from '../models/Change'

describe('StreamWorker', () => {
    const momentContent: MomentContent = {
        slug: 'birthday',
        root: { id: 'root', type: 'box' },
    }
    const storedMoment = { id: 1, slug: 'birthday' } as Moment
    const storedChange = { id: 2, moment_id: 1 } as Change

    let captureMoment: ReturnType<typeof vi.fn>
    let patchMoment: ReturnType<typeof vi.fn>
    let momentService: MomentServiceInterface
    let changeService: ChangeServiceInterface
    let streamCacheService: StreamCacheService

    beforeEach(() => {
        captureMoment = vi.fn()
        patchMoment = vi.fn()
        momentService = {
            store: vi.fn().mockResolvedValue(storedMoment),
        } as unknown as MomentServiceInterface
        changeService = {
            store: vi.fn().mockResolvedValue(storedChange),
        } as unknown as ChangeServiceInterface
        streamCacheService = new StreamCacheService()
    })

    it('persists a captured moment without an attached client and retains the result', async () => {
        captureMoment.mockImplementation(async function* () {
            yield { chunk: '{"slug":' }
            yield { done: true, momentContent }
        })
        const llmService = {
            captureMoment,
            patchMoment,
        } as unknown as LLMServiceInterface
        const worker = new StreamWorker(llmService, streamCacheService)

        worker.capture(7, 'Build a birthday page', async data => {
            return momentService.store({
                user_id: 7,
                slug: data.momentContent.slug,
                prompt: data.prompt,
                content: data.momentContent,
            })
        })

        await vi.waitFor(() => expect(worker.isGenerating(7)).toBe(false))
        expect(momentService.store).toHaveBeenCalledWith({
            user_id: 7,
            slug: 'birthday',
            prompt: 'Build a birthday page',
            content: momentContent,
        })
        expect(worker.hasCapture(7)).toBe(true)
        expect(worker.getBufferedEvents(7)).toEqual([
            { event: 'chunk', data: { chunk: '{"slug":' } },
            { event: 'done', data: storedMoment },
        ])

        streamCacheService.clear(7)
    })

    it('persists a patch without an attached client and clears its stream', async () => {
        patchMoment.mockImplementation(async function* () {
            yield { done: true, momentContent }
        })
        const llmService = {
            captureMoment,
            patchMoment,
        } as unknown as LLMServiceInterface
        const worker = new StreamWorker(llmService, streamCacheService)

        worker.patch(
            7,
            {
                nodeId: 'hero',
                prompt: 'Make it brighter',
                content: momentContent,
                history: ['Use a dark background'],
            },
            async data => {
                return changeService.store({
                    moment_id: 1,
                    node_id: 'hero',
                    prompt: 'Make it brighter',
                    old_content: momentContent,
                    new_content: data.momentContent,
                })
            },
        )

        await vi.waitFor(() => expect(changeService.store).toHaveBeenCalledOnce())
        expect(changeService.store).toHaveBeenCalledWith({
            moment_id: 1,
            node_id: 'hero',
            prompt: 'Make it brighter',
            old_content: momentContent,
            new_content: momentContent,
        })
        expect(worker.isGenerating(7)).toBe(false)
        expect(worker.hasCapture(7)).toBe(false)
        expect(worker.getBufferedEvents(7)).toEqual([])
    })

    it('retains capture errors when no client is attached', async () => {
        captureMoment.mockImplementation(async function* () {
            yield { error: 'Generation failed.' }
        })
        const llmService = {
            captureMoment,
            patchMoment,
        } as unknown as LLMServiceInterface
        const worker = new StreamWorker(llmService, streamCacheService)

        worker.capture(7, 'Build a birthday page', async data => {
            return momentService.store({
                user_id: 7,
                slug: data.momentContent.slug,
                prompt: data.prompt,
                content: data.momentContent,
            })
        })

        await vi.waitFor(() => expect(worker.isGenerating(7)).toBe(false))
        expect(worker.getBufferedEvents(7)).toEqual([
            { event: 'error', data: { error: 'Generation failed.' } },
        ])

        streamCacheService.clear(7)
    })
})
