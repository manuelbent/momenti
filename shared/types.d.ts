type FormField =
    |{ type: 'subject'; text: string }
    |{ type: 'radio'; name: string; label?: string; options: { label: string; value: string }[] }
    |{ type: 'input'; name: string; label?: string; placeholder?: string }

interface MomentContent {
    slug: string;
    fonts?: string[];
    root: MomentNode;
}

interface MomentNode {
    id: string;
    type: 'box'|'text'|'image'|'form'|'map'|'countdown'|'link';
    variant?: 'hero'|'section'|'grid'|'card'|'overlay';
    layout?: 'row'|'column'|'grid';
    columns?: number;
    css?: string;
    tag?: string;
    html?: string;
    src?: string;
    alt?: string;
    address?: string;
    targetDate?: string;
    fields?: FormField[];
    buttonLabel?: string;
    inputCss?: string;
    buttonCss?: string;
    href?: string;
    platform?: string;
    children?: MomentNode[];
}

interface Moment {
    id: number;
    user_id: number|null;
    slug: string;
    prompt: string;
    content: MomentContent;
    is_published: boolean;
    created_at: Date;
    updated_at: Date|null;
}

interface CssComputedVals {
    color: string;
    fontSizePx: number|'';
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
}
