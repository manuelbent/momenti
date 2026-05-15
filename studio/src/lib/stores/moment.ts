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

export const deleteNode = (id: string) => {
    moment.update(m => {
        const deleteRecursive = (node: MomentNode): MomentNode => {
            if (!node.children) return node
            return {
                ...node,
                children: node.children
                    .filter(c => c.id !== id)
                    .map(deleteRecursive)
            }
        }
        return { ...m, content: { ...m.content, root: deleteRecursive(m.content.root) } }
    })
}

// tracks the currently-selected node in the builder
export const selectedNodeId     = writable<string|null>(null)
export const selectedNodeType   = writable<MomentNode['type']|null>(null)
export const selectedNodeDeleteId = writable<string|null>(null)
export const selectedNodeRect   = writable<DOMRect|null>(null)

/** Select any node. Pass deleteId = parentId when the whole parent section should be removed (e.g. form). */
export const selectNode = ({ id, type, deleteId }: { id: string, type: MomentNode['type'], deleteId: string }) => {
    selectedNodeId.set(id)
    selectedNodeType.set(type)
    selectedNodeDeleteId.set(deleteId)
}

export const clearSelection = () => {
    selectedNodeId.set(null)
    selectedNodeType.set(null)
    selectedNodeDeleteId.set(null)
}

// true when the active moment contains at least one form node
const hasFormNodeRecursive = (node: MomentNode): boolean =>
    node.type === 'form' || (node.children?.some(hasFormNodeRecursive) ?? false)

export const hasForms = derived(moment, $m =>
    $m ? hasFormNodeRecursive($m.content.root) : false
)

