export interface MomentNode {
    id: string
    type: 'box'|'text'|'image'|'form'
    css?: string
    tag?: string
    html?: string
    src?: string
    alt?: string
    placeholder?: string
    buttonLabel?: string
    inputCss?: string
    buttonCss?: string
    children?: MomentNode[]
}

export interface Moment {
    slug: string
    root: MomentNode
}
