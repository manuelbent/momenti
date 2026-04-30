interface MomentNode {
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

interface Content {
    slug: string
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
