import { beforeEach, describe, expect, it, vi } from 'vitest'
import ImageRepositoryInterface from '../interfaces/ImageRepositoryInterface'
import Image from '../models/Image'
import ImageService from './ImageService'

describe('ImageService', () => {
    let create: ReturnType<typeof vi.fn>
    let service: ImageService

    beforeEach(() => {
        create = vi.fn()

        const repository = { create } as unknown as ImageRepositoryInterface
        service = new ImageService(repository)
    })

    it('delegates image persistence to the repository', async () => {
        const image = { id: 1, url: 'https://images.example/hero.png' } as Image
        create.mockResolvedValue(image)

        await expect(service.store({ url: image.url, type: 'generated' })).resolves.toBe(image)
        expect(create).toHaveBeenCalledWith({ url: image.url, type: 'generated' })
    })
})
