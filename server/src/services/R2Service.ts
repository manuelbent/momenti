import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { randomUUID } from 'crypto'
import path from 'path'
import R2ServiceInterface from '../interfaces/R2ServiceInterface'

/**
 * Thin wrapper around the Cloudflare R2 bucket.
 * @class R2Service
 */
export default class R2Service implements R2ServiceInterface {
    /**
     * @private {S3Client}
     */
    private client: S3Client

    /**
     * @private {string}
     */
    private readonly bucket: string

    /**
     * @private {string}
     */
    private readonly publicUrl: string

    /**
     * @constructor
     */
    constructor() {
        const accountId  = process.env.R2_ACCOUNT_ID
        const accessKeyId = process.env.R2_ACCESS_KEY_ID
        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
        this.bucket = process.env.R2_BUCKET_NAME ?? ''
        this.publicUrl = (process.env.R2_PUBLIC_URL ?? '').replace(/\/$/, '')

        if (!accountId || !accessKeyId || !secretAccessKey || !this.bucket || !this.publicUrl) {
            throw new Error('R2 environment variables are not fully configured.')
        }

        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId, secretAccessKey },
        })
    }

    /**
     * Upload a file buffer to R2.
     * @param buffer   Raw file bytes
     * @param mimetype MIME type (e.g. "image/jpeg")
     * @param originalName Original filename (used to preserve the extension)
     * @returns The permanent public URL of the stored object
     */
    public async upload(buffer: Buffer, mimetype: string, originalName: string): Promise<string> {
        const ext = path.extname(originalName) || ''
        const key = `images/${randomUUID()}${ext}`

        await this.client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
        }))

        return `${this.publicUrl}/${key}`
    }
}
