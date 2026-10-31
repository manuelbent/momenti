import { API_URL, authHeaders } from './client'
import { isRecord } from './stream'

/**
 * Upload an image file directly to R2 using a server-issued presigned URL.
 * @param options The target Moment and selected file
 * @returns The permanent public URL of the uploaded image
 */
export const uploadImage = async ({ momentId, file }: UploadImageOptions): Promise<string> => {
    const res = await fetch(`${API_URL}/moments/${momentId}/images`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ contentType: file.type, size: file.size }),
    })

    if (!res.ok) {
        const err: unknown = await res.json()
        throw new Error(isRecord(err) && typeof err.error === 'string'
            ? err.error
            : `Failed to authorize image upload: ${res.status}`)
    }

    const { uploadUrl, headers, url }: PresignedUploadResponse = await res.json()
    const upload = await fetch(uploadUrl, {
        method: 'PUT',
        headers,
        body: file,
    })

    if (!upload.ok) {
        throw new Error(`Failed to upload image: ${upload.status}`)
    }

    return url
}
