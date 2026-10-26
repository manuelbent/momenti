import OpenAI from 'openai'
import Image from '../models/Image'
import ImageRepositoryInterface from '../interfaces/ImageRepositoryInterface'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'

/**
 * @class ImageService
 */
export default class ImageService implements ImageServiceInterface {
    /**
     * The OpenAI client instance.
     * @private
     */
    private openai: OpenAI

    /**
     * @constructor
     * @param {ImageRepositoryInterface} imageRepository
     */
    constructor(private imageRepository: ImageRepositoryInterface) {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    /**
     * Generate an image from a text prompt.
     * @param {string} prompt
     * @returns {Promise<Buffer>}
     */
    public async generate(prompt: string): Promise<Buffer> {
        const response = await this.openai.images.generate({
            model: 'gpt-image-2.5-flare',
            prompt,
            output_format: 'png',
            quality: 'low',
            size: '1536x1024',
        })
        const encoded = response.data?.[0]?.b64_json

        if (!encoded) {
            throw new Error('OpenAI did not return generated image data.')
        }

        return Buffer.from(encoded, 'base64')
    }

    /**
     * Store a new image entry.
     * @param {Partial<Image>} data
     * @returns {Promise<Image>}
     */
    public async store(data: Partial<Image>): Promise<Image> {
        return this.imageRepository.create(data)
    }
}
