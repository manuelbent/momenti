import { writable } from 'svelte/store'

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

export const updateNode = (id: string, newData: Partial<MomentNode>) => {
    moment.update(m => {
        const updateRecursive = (node: MomentNode): MomentNode => {
            if (node.id === id) {
                return { ...node, ...newData }
            }
            if (node.children) {
                return { ...node, children: node.children.map(updateRecursive) }
            }
            return node
        }
        return { ...m, content: { ...m.content, root: updateRecursive(m.content.root) } }
    })
}

// tracks the currently-selected text node in the builder
export const selectedNodeId = writable<string|null>(null)
export const selectedNodeRect = writable<DOMRect|null>(null)
