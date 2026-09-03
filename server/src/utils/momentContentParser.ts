const stripHtml = (value: string): string => value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

const extractNodeText = (node: MomentNode): string[] => {
    const text = node.type === 'text' && node.html
        ? [stripHtml(node.html)]
        : []

    for (const child of node.children ?? []) {
        text.push(...extractNodeText(child))
    }

    return text.filter(Boolean)
}

export const parse = (content: MomentContent): string => {
    return extractNodeText(content.root).join(' - ')
}
