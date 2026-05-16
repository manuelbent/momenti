import { API_URL, authHeaders } from './client'

/**
 * Upload an image file to R2 via the server.
 * @param file The image File object from an <input type="file">
 * @returns The permanent public URL of the uploaded image
 */
export const uploadImage = async (file: File): Promise<string> => {
    const headers = authHeaders() as Record<string, string>
    // Remove Content-Type so the browser sets the correct multipart boundary
    delete headers['Content-Type']

    const body = new FormData()
    body.append('file', file)

    const res = await fetch(`${API_URL}/images`, {
        method: 'POST',
        headers,
        body,
    })

    if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? `Upload failed: ${res.status}`)
    }

    const { url } = await res.json()
    return url
}

