import { NextFunction, Request, Response } from 'express'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import R2ServiceInterface from '../interfaces/R2ServiceInterface'
import ImageGenerationController from './ImageGenerationController'

describe('ImageGenerationController', () => {
    const prompt = 'Create a garden wedding page'
    const imagePrompt = 'A candlelit garden wedding at dusk, wide cinematic composition'

    let generateImagePrompt: ReturnType<typeof vi.fn>
    let generateImage: ReturnType<typeof vi.fn>
    let storeImage: ReturnType<typeof vi.fn>
    let upload: ReturnType<typeof vi.fn>
    let next: ReturnType<typeof vi.fn>
    let res: Response
    let controller: ImageGenerationController

    beforeEach(() => {
        generateImagePrompt = vi.fn().mockResolvedValue(imagePrompt)
        generateImage = vi.fn().mockResolvedValue(Buffer.from('generated-image'))
        storeImage = vi.fn()
        upload = vi.fn().mockResolvedValue('https://images.example/hero.png')
        next = vi.fn()

        const imageService = {
            generate: generateImage,
            store: storeImage,
        } as ImageServiceInterface
        const r2Service = { upload } as R2ServiceInterface
        const llmService = { generateImagePrompt } as unknown as LLMServiceInterface
        controller = new ImageGenerationController(imageService, r2Service, llmService)
        res = {
            locals: {},
            write: vi.fn(),
            end: vi.fn(),
        } as unknown as Response
    })

    it('generates and uploads an image, then passes its URL onward', async () => {
        const req = { body: { prompt } } as Request

        await controller.handle(req, res, next as NextFunction)

        expect(generateImagePrompt).toHaveBeenCalledWith(prompt)
        expect(generateImage).toHaveBeenCalledWith(imagePrompt)
        expect(upload).toHaveBeenCalledWith(
            Buffer.from('generated-image'),
            'image/png',
            'generated.png',
        )
        expect(res.locals.heroImageUrl).toBe('https://images.example/hero.png')
        expect(storeImage).not.toHaveBeenCalled()
        expect(next).toHaveBeenCalledOnce()
    })

    it('ends the SSE response when image generation fails', async () => {
        generateImage.mockRejectedValue(new Error('Image API unavailable'))
        const req = { body: { prompt } } as Request

        await controller.handle(req, res, next as NextFunction)

        expect(upload).not.toHaveBeenCalled()
        expect(storeImage).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.write).toHaveBeenNthCalledWith(1, 'event: progress\n')
        expect(res.write).toHaveBeenNthCalledWith(
            2,
            'data: {"stage":"planning-image"}\n\n',
        )
        expect(res.write).toHaveBeenNthCalledWith(3, 'event: progress\n')
        expect(res.write).toHaveBeenNthCalledWith(
            4,
            'data: {"stage":"generating-image"}\n\n',
        )
        expect(res.write).toHaveBeenNthCalledWith(5, 'event: error\n')
        expect(res.write).toHaveBeenNthCalledWith(
            6,
            'data: {"error":"Failed to generate the hero image."}\n\n',
        )
        expect(res.end).toHaveBeenCalledOnce()
    })

    it('does not call the image API when prompt generation fails', async () => {
        generateImagePrompt.mockRejectedValue(new Error('Prompt API unavailable'))
        const req = { body: { prompt } } as Request

        await controller.handle(req, res, next as NextFunction)

        expect(generateImage).not.toHaveBeenCalled()
        expect(upload).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
        expect(res.end).toHaveBeenCalledOnce()
    })
})
