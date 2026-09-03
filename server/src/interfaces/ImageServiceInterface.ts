import Image from '../models/Image'

/**
 * @interface ImageServiceInterface
 */
export default interface ImageServiceInterface {
    generate(prompt: string): Promise<Buffer>
    store(data: Partial<Image>): Promise<Image>
}
