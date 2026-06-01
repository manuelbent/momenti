export const findNode = (root: MomentNode, id: string): MomentNode | null => {
    if (root.id === id) return root
    for (const child of root.children ?? []) {
        const found = findNode(child, id)
        if (found) return found
    }
    return null
}

export const findFirstImage = (node: MomentNode): MomentNode | null => {
    if (node.type === 'image') return node
    for (const child of node.children ?? []) {
        const found = findFirstImage(child)
        if (found) return found
    }
    return null
}

