import ImageRepositoryInterface from '../interfaces/ImageRepositoryInterface'
import BaseRepository from './BaseRepository'
import Image from '../models/Image'

/**
 * @class ImageRepository
 */
export default class ImageRepository extends BaseRepository<Image> implements ImageRepositoryInterface {
    constructor() { super(Image) }
}
