import { beforeEach, describe, expect, it, vi } from 'vitest'
import ImageRepositoryInterface from '../interfaces/ImageRepositoryInterface'
import Image from '../models/Image'
import ImageService from './ImageService'

const { generate } = vi.hoisted(() => ({
    generate: vi.fn(),
}))

vi.mock('openai', () => ({
    default: class {
        images = { generate }
    },
}))

describe('ImageService', () => {
    let create: ReturnType<typeof vi.fn>
    let service: ImageService

    beforeEach(() => {
        create = vi.fn()
        generate.mockReset()

        const repository = { create } as unknown as ImageRepositoryInterface
        service = new ImageService(repository)
    })

    it('generates one image and returns its decoded buffer', async () => {
        generate.mockResolvedValue({
            data: [{ b64_json: Buffer.from('image-data').toString('base64') }],
        })

        await expect(service.generate('A candlelit garden')).resolves.toEqual(Buffer.from('image-data'))
        expect(generate).toHaveBeenCalledWith({
            model: 'gpt-image-1',
            prompt: 'A candlelit garden',
            output_format: 'png',
            quality: 'low',
            size: '1536x1024',
        })
        expect(create).not.toHaveBeenCalled()
    })

    it('rejects when the image API returns no data', async () => {
        generate.mockResolvedValue({ data: [] })

        await expect(service.generate('A candlelit garden'))
            .rejects.toThrow('OpenAI did not return generated image data.')
        expect(create).not.toHaveBeenCalled()
    })

    it('delegates image persistence to the repository', async () => {
        const image = { id: 1, url: 'https://images.example/hero.png' } as Image
        create.mockResolvedValue(image)

        await expect(service.store({ url: image.url, type: 'generated' })).resolves.toBe(image)
        expect(create).toHaveBeenCalledWith({ url: image.url, type: 'generated' })
    })
})
