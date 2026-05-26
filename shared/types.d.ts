interface Moment {
    id: number
    slug: string
    prompt: string
    content: MomentContent
    is_published: boolean
    created_at: string
    updated_at: string
}

interface MomentContent {
    meta: MomentMeta
    globalTheme: GlobalTheme
    canvas: Canvas
}

interface MomentMeta {
    momentId: string
    pageType: 'portfolio'|'event'|'affiliate'|'product'|'business'
    title: string
    description?: string
}

interface GlobalTheme {
    fonts: {
        heading: string
        body: string
    }
    tokens: {
        brandPrimary: string
        brandSecondary: string
        bgGlobal: string
        textGlobal: string
        borderRadiusGlobal: 'none'|'sm'|'md'|'lg'|'full'
    }
}

interface Canvas {
    sections: SectionNode[]
}

interface SectionNode {
    id: string
    layout: {
        type: 'full-width-hero'|'split-50-50'|'3-column-grid'|'single-column-stack'
        padding: 'compact'|'normal'|'loose'
    }
    visuals?: {
        bgType?: 'solid'|'gradient'|'image'
        bgValue?: string
        floatingDecorations?: Array<'glowing-blur-blob'|'animated-mesh-lines'|'geometric-particles'>
    }
    children: ComponentNode[]
}

type ComponentData =
    |{ type: 'text_block'; data: { text: string; headingSize?: 'sm'|'md'|'lg' } }
    |{ type: 'action_button'; data: { text: string; link: string } }
    |{ type: 'interactive_form'; data: { formId: string; inputs: string[]; buttonText: string } }
    |{ type: 'media_card'; data: { title: string; imageSrc?: string; linkUrl?: string } }
    |{ type: 'links_stack'; data: { title?: string; links: Array<{ label: string; url: string }> } }

interface StylingOverrides {
    customTextColor?: string
    alignment?: 'left'|'center'|'right'
    glassmorphism?: boolean
    shadowDepth?: 'none'|'soft'|'heavy-glow'
}

type ComponentNode = {
    id: string
    stylingOverrides: StylingOverrides
    children?: ComponentNode[]
}&ComponentData