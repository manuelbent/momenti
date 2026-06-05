import { writable } from 'svelte/store'
import { getChanges } from '$lib/api/moments'
import { moment } from './moment'

// ordered list of changes for the active moment
export const changes = writable<Change[]>([])

export const changesLoading = writable<boolean>(false)

export const loadChanges = async (momentId: number): Promise<void> => {
    changesLoading.set(true)
    try {
        const list = await getChanges(momentId)
        changes.set(list)
    } catch (err) {
        console.error('[Store] Could not load changes.', err)
        changes.set([])
    } finally {
        changesLoading.set(false)
    }
}

export const appendChange = (change: Change): void => {
    changes.update(list => [...list, change])
}

// auto-reload whenever the active moment switches
let lastMomentId: number | undefined

moment.subscribe(async m => {
    if (!m) {
        return
    }

    if (m.id === lastMomentId) {
        return
    }

    lastMomentId = m.id
    changes.set([])
    await loadChanges(m.id)
})

