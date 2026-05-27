import { writable, derived } from 'svelte/store'

// overwrite writeable to add local storage functionality
const useMomentStore = () => {
    const { update, subscribe, set } = writable<Moment>()
    return {
        update,
        subscribe,
        set: (moment: Moment)=> {
            try {
                localStorage.setItem('moment__preview', JSON.stringify(moment))
            } catch (err) {
                console.error('[Store] Could not store moment for preview.')
            }
            set(moment)
        }
    }
}

// AI-generated moment, stored by the back end and rendered by the Studio
export const moment = useMomentStore()

// full list of moments (sidebar)
export const moments = writable<Moment[]>([])

// used when loading moments
export const isLoading = writable<boolean>(false)

// keep the moments list in sync whenever the active moment changes
moment.subscribe(updated => {
    if (!updated) {
        return
    }

    moments.update(list => {
        const exists = list.some(m => m.id === updated.id)
        if (exists) {
            return list.map(m => m.id === updated.id ? updated : m)
        }
        // new moment (e.g. after re-capture) — prepend to keep recency order
        return [updated, ...list]
    })
})

// true when the active moment contains at least one form node
const hasFormNodeRecursive = (node: MomentNode): boolean =>
    node.type === 'form' || (node.children?.some(hasFormNodeRecursive) ?? false)

export const hasForms = derived(moment, $m =>
    $m ? hasFormNodeRecursive($m.content.root) : false
)
