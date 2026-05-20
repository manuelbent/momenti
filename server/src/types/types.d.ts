interface MomentNode {
    id: string
    type: 'box'|'text'|'image'|'form'|'map'|'countdown'
    css?: string
    tag?: string
    html?: string
    src?: string
    alt?: string
    address?: string
    targetDate?: string
    placeholder?: string
    buttonLabel?: string
    inputCss?: string
    buttonCss?: string
    children?: MomentNode[]
}

interface RawMoment {
    slug: string
    fonts?: string[]
    root: MomentNode
}

interface StreamEvent {
    event: 'chunk' | 'done' | 'error'
    data: unknown
}
