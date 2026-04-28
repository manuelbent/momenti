import { writable } from 'svelte/store'

export interface MomentNode {
    id: string
    type: 'box'|'text'|'image'|'form'
    css?: string
    // text props
    tag?: string
    html?: string
    // image props
    src?: string
    alt?: string
    // form props
    placeholder?: string
    buttonLabel?: string
    // css
    inputCss?: string
    buttonCss?: string
    // tree
    children?: MomentNode[]
}

export interface Moment {
    slug: string
    root: MomentNode
}

// Holds the AI-generated moment that the Preview route renders
export const moment = writable<Moment>()

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
        return { ...m, root: updateRecursive(m.root) }
    })
}
