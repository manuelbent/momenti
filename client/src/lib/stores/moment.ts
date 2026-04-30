import { writable } from 'svelte/store'

// AI-generated moment, stored by the back end and rendered by the Studio
export const moment = writable<Moment>()

// Tracks the currently-selected text node in the builder
export const selectedNodeId = writable<string|null>(null)
export const selectedNodeRect = writable<DOMRect|null>(null)

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
        return { ...m, root: updateRecursive(m.content.root) }
    })
}
