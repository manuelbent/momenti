import { writable } from 'svelte/store'

// AI-generated moment, stored by the back end and rendered by the Studio
export const moment = writable<Moment>()

// full list of moments (sidebar)
export const moments = writable<Moment[]>([])

// keep the moments list in sync whenever the active moment changes
moment.subscribe(updated => {
    if (!updated) return
    moments.update(list =>
        list.map(m => m.id === updated.id ? updated : m)
    )
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
