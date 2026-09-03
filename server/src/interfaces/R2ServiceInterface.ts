/**
 * @interface R2ServiceInterface
 */
export default interface R2ServiceInterface {
    upload(buffer: Buffer, mimetype: string, originalName: string): Promise<string>
}
