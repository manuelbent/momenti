import { writable, derived } from 'svelte/store'
import { moment } from '$lib/stores/moment'
import { findNode, findFirstImage } from '$lib/utils/nodeTree'

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

interface SelectedNode {
    id: string
    type: MomentNode['type']
    deleteId: string
    rect?: DOMRect | null
}

export const selectedNode = writable<SelectedNode|null>(null)

/** Select any node. Pass deleteId = parentId when the whole parent section should be removed (e.g. form). */
export const selectNode = ({ id, type, deleteId, rect }: { id: string, type: MomentNode['type'], deleteId: string, rect?: DOMRect | null }) => {
    selectedNode.set({ id, type, deleteId, rect })
}

export const clearSelection = () => {
    selectedNode.set(null)
}

export const addChildNode = (parentId: string, newNode: MomentNode) => {
    moment.update(m => {
        const addRecursive = (node: MomentNode): MomentNode => {
            if (node.id === parentId) {
                return { ...node, children: [...(node.children ?? []), newNode] }
            }
            if (node.children) {
                return { ...node, children: node.children.map(addRecursive) }
            }
            return node
        }
        return { ...m, content: { ...m.content, root: addRecursive(m.content.root) } }
    })
}

/** The full MomentNode for the currently selected element, or null. */
export const selectedFullNode = derived([moment, selectedNode], ([$moment, $sel]) => {
    if (!$sel?.id || !$moment) return null
    return findNode($moment.content.root, $sel.id)
})

/**
 * When a hero box is selected, resolves to its first image descendant.
 * Null in all other cases.
 */
export const selectedHeroImageNode = derived([moment, selectedNode], ([$moment, $sel]) => {
    if (!$sel?.id || !$moment || $sel.type !== 'box') return null
    const boxNode = findNode($moment.content.root, $sel.id)
    if (boxNode?.variant !== 'hero') return null
    return findFirstImage(boxNode)
})

