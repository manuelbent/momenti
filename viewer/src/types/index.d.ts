type FormField =
    | { type: 'subject'; text: string }
    | { type: 'radio';   name: string; label?: string; options: { label: string; value: string }[] }
    | { type: 'input';   name: string; label?: string; placeholder?: string }

interface MomentNode {
    id: string;
    type: 'box'|'text'|'image'|'form'|'map'|'countdown';
    variant?: 'hero'|'section'|'grid'|'card'|'overlay';
    layout?: 'row'|'column'|'grid';
    columns?: number;
    css?: string;
    tag?: string;
    html?: string;
    src?: string;
    alt?: string;
    address?: string; // The AI will populate this
    targetDate?: string; // ISO 8601 date string for countdown nodes
    // form node
    fields?: FormField[];
    buttonLabel?: string;
    inputCss?: string;
    buttonCss?: string;
    children?: MomentNode[];
}

interface Content {
    slug: string
    fonts?: string[]
    root: MomentNode
}

interface Moment {
    id: number
    user_id: number|null
    slug: string
    prompt: string
    content: Content
    is_published: boolean
    created_at: Date
    updated_at: Date|null
}

interface CssComputedVals {
    color: string
    fontSizePx: number | ''
    isBold: boolean
    isItalic: boolean
    isUnderline: boolean
}
