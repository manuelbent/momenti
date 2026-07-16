type FormField =
    |{ type: 'subject'; text: string }
    |{ type: 'radio'; name: string; label?: string; options: { label: string; value: string }[] }
    |{ type: 'input'; name: string; label?: string; placeholder?: string }

interface MomentContent {
    slug: string;
    fonts?: string[];
    root: MomentNode;
}

interface ArtDirectionBrief {
    mood: string;
    narrative: string;
    composition: string;
    focalPoint: string;
    typography: string;
    palette: string;
    imageTreatment: string;
    motion: string;
    mobileInterpretation: string;
    distinctiveMove: string;
    avoid: string[];
}

interface MomentNode {
    id: string;
    type: 'box'|'text'|'image'|'form'|'map'|'countdown'|'link'|'navbar'|'footer'|'carousel';
    variant?: 'hero'|'section'|'grid'|'card'|'overlay';
    layout?: 'row'|'column'|'grid';
    mobileLayout?: 'row'|'column'|'grid';
    columns?: number;
    animation?: 'fade-up'|'fade-in'|'scale-in'|'slide-right';
    animationDelay?: number;
    aspectRatio?: 'square'|'portrait'|'landscape'|'wide';
    css?: string;
    mobileCss?: string;
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
    links?: { label: string; anchor: string }[];
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
