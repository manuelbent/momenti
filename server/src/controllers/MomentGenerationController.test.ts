import { EventEmitter } from 'node:events'
import { Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ChangeServiceInterface from '../interfaces/ChangeServiceInterface'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'
import MomentServiceInterface from '../interfaces/MomentServiceInterface'
import R2ServiceInterface from '../interfaces/R2ServiceInterface'
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
    const updatedMoment = {
        id: 12,
        slug: 'garden-wedding',
    } as Moment

    let completion: (data: {
        prompt: string
        momentContent: MomentContent
    }) => Promise<unknown>
    let storeMoment: ReturnType<typeof vi.fn>
    let updateMoment: ReturnType<typeof vi.fn>
    let generateImage: ReturnType<typeof vi.fn>
    let storeImage: ReturnType<typeof vi.fn>
    let upload: ReturnType<typeof vi.fn>
    let controller: MomentGenerationController

    beforeEach(() => {
        storeMoment = vi.fn().mockResolvedValue(storedMoment)
        updateMoment = vi.fn().mockResolvedValue(updatedMoment)
        generateImage = vi.fn()
        storeImage = vi.fn()
        upload = vi.fn()

        const momentService = {
            store: storeMoment,
            update: updateMoment,
        } as unknown as MomentServiceInterface
        const changeService = {} as ChangeServiceInterface
        const streamWorker = {
            capture: vi.fn((
                _userId: number,
                _prompt: string,
                onDone: typeof completion,
            ) => {
                completion = onDone
                return new EventEmitter()
            }),
        } as unknown as StreamWorkerInterface
        const imageService = {
            generate: generateImage,
            store: storeImage,
        } as ImageServiceInterface
        const r2Service = { upload } as R2ServiceInterface

        controller = new MomentGenerationController(
            momentService,
            changeService,
            streamWorker,
            imageService,
            r2Service,
        )

        const req = {
            body: { prompt },
            once: vi.fn(),
        } as unknown as Request
        const res = {
            locals: { user: { id: userId } },
            write: vi.fn(),
            end: vi.fn(),
        } as unknown as Response

        controller.capture(req, res)
    })

    it('stores a moment without generating when no eligible hero image exists', async () => {
        const content: MomentContent = {
            slug: 'garden-wedding',
            root: { id: 'root', type: 'box' },
        }

        await expect(completion({ prompt, momentContent: content })).resolves.toBe(storedMoment)
        expect(generateImage).not.toHaveBeenCalled()
        expect(upload).not.toHaveBeenCalled()
        expect(storeImage).not.toHaveBeenCalled()
        expect(updateMoment).not.toHaveBeenCalled()
    })

    it('generates one hero image, stores it, and updates the moment content', async () => {
        const imageNode: MomentNode = {
            id: 'hero-image',
            type: 'image',
            src: 'https://placehold.co/1200x800?text=Image',
            generationPrompt: 'A candlelit garden at dusk',
        }
        const content: MomentContent = {
            slug: 'garden-wedding',
            root: {
                id: 'root',
                type: 'box',
                children: [
                    {
                        id: 'hero',
                        type: 'box',
                        variant: 'hero',
                        children: [imageNode],
                    },
                ],
            },
        }
        const buffer = Buffer.from('generated-image')
        generateImage.mockResolvedValue(buffer)
        upload.mockResolvedValue('https://images.example/hero.png')
        storeImage.mockResolvedValue({ id: 2 })

        await expect(completion({ prompt, momentContent: content })).resolves.toBe(updatedMoment)
        expect(generateImage).toHaveBeenCalledOnce()
        expect(generateImage).toHaveBeenCalledWith(imageNode.generationPrompt)
        expect(upload).toHaveBeenCalledWith(buffer, 'image/png', 'generated.png')
        expect(storeImage).toHaveBeenCalledWith({
            url: 'https://images.example/hero.png',
            type: 'generated',
            moment_id: 12,
            moment_node_id: 'hero-image',
            purpose: 'hero',
            prompt: imageNode.generationPrompt,
        })
        expect(imageNode.src).toBe('https://images.example/hero.png')
        expect(updateMoment).toHaveBeenCalledWith(12, { content })
    })

    it('propagates image generation failures without storing image metadata', async () => {
        const content: MomentContent = {
            slug: 'garden-wedding',
            root: {
                id: 'hero',
                type: 'box',
                variant: 'hero',
                children: [
                    {
                        id: 'hero-image',
                        type: 'image',
                        src: 'https://placehold.co/1200x800?text=Image',
                        generationPrompt: 'A candlelit garden at dusk',
                    },
                ],
            },
        }
        generateImage.mockRejectedValue(new Error('Image API unavailable'))

        await expect(completion({ prompt, momentContent: content }))
            .rejects.toThrow('Image API unavailable')
        expect(upload).not.toHaveBeenCalled()
        expect(storeImage).not.toHaveBeenCalled()
        expect(updateMoment).not.toHaveBeenCalled()
    })
})
