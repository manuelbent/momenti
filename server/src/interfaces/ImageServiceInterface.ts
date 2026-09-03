import Image from '../models/Image'

/**
 * @interface ImageServiceInterface
 */
export default interface ImageServiceInterface {
    store(data: Partial<Image>): Promise<Image>
}
