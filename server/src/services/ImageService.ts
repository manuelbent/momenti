import Image from '../models/Image'
import ImageRepositoryInterface from '../interfaces/ImageRepositoryInterface'
import ImageServiceInterface from '../interfaces/ImageServiceInterface'

/**
 * @class ImageService
 */
export default class ImageService implements ImageServiceInterface {
    /**
     * @constructor
     * @param {ImageRepositoryInterface} imageRepository
     */
    constructor(private imageRepository: ImageRepositoryInterface) {}

    /**
     * Store a new image entry.
     * @param {Partial<Image>} data
     * @returns {Promise<Image>}
     */
    public async store(data: Partial<Image>): Promise<Image> {
        return this.imageRepository.create(data)
    }
}
