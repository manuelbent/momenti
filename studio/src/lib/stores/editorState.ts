import { writable, derived, get } from 'svelte/store'
import { moment, savedAt } from '$lib/stores/moment'

interface EditorState {
    isDirty: boolean
    slugAvailable: boolean | null
    slugChecking: boolean
}

const initial: EditorState = {
    isDirty: false,
    slugAvailable: null,
    slugChecking: false,
}

// map of moment ID to editor state, to persist state when switching between moments
const stateMap = new Map<number, EditorState>()

const store = writable<EditorState>(initial)
const { subscribe, set, update } = store

let currentMomentId: number | null = null

// when the moment changes, save the current state and load the new one (or start fresh)
moment.subscribe($m => {
    const newId = $m?.id ?? null
    if (newId === currentMomentId) {
        return
    }

    // set the current state for the old moment ID, if any
    if (currentMomentId !== null) {
        stateMap.set(currentMomentId, { ...get(store), slugChecking: false })
    }

    // load the state for the new moment ID, or reset to initial if none
    currentMomentId = newId
    if (newId !== null && stateMap.has(newId)) {
        set(stateMap.get(newId)!)
    } else {
        set(initial)
    }
})

// after a successful save: clear the stored state for this moment and reset
savedAt.subscribe(() => {
    if (currentMomentId !== null) {
        stateMap.delete(currentMomentId)
    }

    set(initial)
})

export const editorState = {
    subscribe,
    setDirty: () => update(s => ({ ...s, isDirty: true })),
    setSlugAvailable: (v: boolean | null) => update(s => ({ ...s, slugAvailable: v })),
    setSlugChecking: (v: boolean) => update(s => ({ ...s, slugChecking: v })),
}

/**
 * True when the save button should be enabled:
 * - content has changed (isDirty), OR the slug was explicitly checked and is available
 * - AND no slug check is currently in progress
 */
export const canSave = derived(
    { subscribe },
    ($s) => ($s.isDirty || $s.slugAvailable === true) && !$s.slugChecking
)

