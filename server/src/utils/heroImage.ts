export const findGeneratedHeroImage = (root: MomentNode): MomentNode|undefined => {
    const findImage = (node: MomentNode): MomentNode|undefined => {
        if (node.type === 'image' && node.generationPrompt?.trim()) {
            return node
        }

        for (const child of node.children ?? []) {
            const image = findImage(child)
            if (image) return image
        }
    }

    if (root.variant === 'hero') {
        return findImage(root)
    }

    for (const child of root.children ?? []) {
        const image = findGeneratedHeroImage(child)
        if (image) return image
    }
}
