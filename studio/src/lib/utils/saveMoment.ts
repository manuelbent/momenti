import { get } from 'svelte/store'
import { moment, savedAt } from '$lib/stores/moment'
import { showToast } from '$lib/stores/toast'
import { updateMoment } from '$lib/api'
import { resolvePendingImages } from '$lib/utils/resolvePendingImages'

/**
 * Persists the currently active moment to the back end: resolves any pending
 * (blob) images, sends the update, syncs the moment/savedAt stores and shows a
 * toast. Returns the updated moment, or null if there was nothing to save or
 * the request failed.
 */
export async function saveMoment(): Promise<Moment | null> {
    const current = get(moment)
    if (!current) {
        return null
    }

    try {
        const content = await resolvePendingImages(current.content)
        const updated: Moment = await updateMoment(current.id, {
            slug: current.slug,
            content,
            // include other fields that can be updated here
        })
        moment.set(updated)
        savedAt.set(Date.now())
        showToast('Moment updated.')
        return updated
    } catch {
        showToast('Something went wrong.', 'error')
        return null
    }
}
