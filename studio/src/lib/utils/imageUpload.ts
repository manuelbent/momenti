import { pendingImages } from '$lib/stores/pendingImages'

/**
 * Creates a blob URL for the file, registers it as a pending upload,
 * and returns the blob URL for immediate use.
 */
export const registerImage = (file: File): string => {
    const blobUrl = URL.createObjectURL(file)
    pendingImages.add(blobUrl, file)
    return blobUrl
}

