import { writable } from 'svelte/store'

export interface MomentNode {
    id: string;
    type: 'box'|'text'|'image'|'form'|'map';
    variant?: 'hero'|'section'|'grid'|'card'|'overlay';
    layout?: 'row'|'column'|'grid';
    columns?: number;
    css?: string;
    tag?: string;
    html?: string;
    src?: string;
    alt?: string;
    address?: string; // The AI will populate this
    placeholder?: string;
    buttonLabel?: string;
    inputCss?: string;
    buttonCss?: string;
    children?: MomentNode[];
}

export interface Moment {
    slug: string
    prompt: string
    root: MomentNode
}

// Holds the AI-generated moment that the Preview route renders
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
        return { ...m, root: updateRecursive(m.root) }
    })
}
