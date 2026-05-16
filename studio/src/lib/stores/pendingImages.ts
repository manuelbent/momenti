import { writable, get } from 'svelte/store'

/**
 * Holds File objects for images that have been previewed locally
 * (via blob URL) but not yet uploaded to R2.
 * Key:   blob URL  (e.g. "blob:http://localhost:5173/…")
 * Value: the original File chosen by the user
 */
const createPendingImagesStore = () => {
    const { subscribe, update } = writable<Map<string, File>>(new Map())

    return {
        subscribe,
        /** Register a new pending upload */
        add: (blobUrl: string, file: File) =>
            update(map => new Map(map).set(blobUrl, file)),
        /** Remove an entry once it has been uploaded */
        remove: (blobUrl: string) =>
            update(map => {
                const next = new Map(map)
                next.delete(blobUrl)
                return next
            }),
        /** Synchronously retrieve the File for a given blob URL */
        get: (blobUrl: string): File|undefined =>
            get({ subscribe }).get(blobUrl),
    }
}

export const pendingImages = createPendingImagesStore()
