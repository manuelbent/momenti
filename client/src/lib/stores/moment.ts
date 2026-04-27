import { writable } from 'svelte/store'

export interface MomentNode {
    id: string
    type: 'box' | 'text' | 'image' | 'form'
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
    // tree
    children?: MomentNode[]
}

export interface Moment {
    slug: string
    root: MomentNode
}

export const moment = writable<Moment>({
    slug: 'sophie-marco-2026',
    root: {
        id: 'page',
        type: 'box',
        css: 'min-height:100vh; font-family:"Playfair Display",serif; background:#fff9fb;',
        children: [
            {
                id: 'hero-section',
                type: 'box',
                css: 'display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px 24px; background:#fce7f3; text-align:center;',
                children: [
                    {
                        id: 'cover',
                        type: 'image',
                        src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&q=80',
                        alt: 'Sophie & Marco',
                        css: 'width:100%; max-height:420px; object-fit:cover; border-radius:12px; margin-bottom:32px;',
                    },
                    {
                        id: 'hero-container',
                        type: 'box',
                        css: 'max-width:600px;',
                        children: [
                            {
                                id: 'title',
                                type: 'text',
                                tag: 'h1',
                                html: 'Sophie &amp; Marco',
                                css: 'font-size:3rem; color:#9d174d; margin:0 0 12px;',
                            },
                            {
                                id: 'subtitle',
                                type: 'text',
                                tag: 'p',
                                html: 'Two hearts, one forever &mdash; Florence, July 12, 2026',
                                css: 'font-size:1.2rem; color:#6b7280; margin:0;',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'gallery-section',
                type: 'box',
                css: 'padding:64px 24px; max-width:960px; margin:0 auto;',
                children: [
                    {
                        id: 'gallery-title',
                        type: 'text',
                        tag: 'h2',
                        html: 'Our Story',
                        css: 'font-size:2rem; color:#9d174d; text-align:center; margin-bottom:32px;',
                    },
                    {
                        id: 'gallery-grid',
                        type: 'box',
                        css: 'display:grid; grid-template-columns:repeat(2,1fr); gap:16px;',
                        children: [
                            {
                                id: 'img-1',
                                type: 'image',
                                src: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80',
                                alt: 'First date in Rome',
                                css: 'width:100%; border-radius:8px; object-fit:cover; aspect-ratio:4/3;',
                            },
                            {
                                id: 'img-2',
                                type: 'image',
                                src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=800&q=80',
                                alt: 'Proposal in Venice',
                                css: 'width:100%; border-radius:8px; object-fit:cover; aspect-ratio:4/3;',
                            },
                            {
                                id: 'img-3',
                                type: 'image',
                                src: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80',
                                alt: 'Engagement shoot',
                                css: 'width:100%; border-radius:8px; object-fit:cover; aspect-ratio:4/3;',
                            },
                            {
                                id: 'img-4',
                                type: 'image',
                                src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
                                alt: 'Together in Tuscany',
                                css: 'width:100%; border-radius:8px; object-fit:cover; aspect-ratio:4/3;',
                            },
                        ],
                    },
                ],
            },
            {
                id: 'rsvp-section',
                type: 'box',
                css: 'padding:64px 24px; background:#fce7f3; text-align:center;',
                children: [
                    {
                        id: 'rsvp-title',
                        type: 'text',
                        tag: 'h2',
                        html: 'Will you join us?',
                        css: 'font-size:2rem; color:#9d174d; margin-bottom:24px;',
                    },
                    {
                        id: 'rsvp-form',
                        type: 'form',
                        placeholder: 'Your full name',
                        buttonLabel: 'RSVP Now',
                        css: 'display:flex; gap:12px; justify-content:center; flex-wrap:wrap;',
                    },
                ],
            },
        ],
    },
})
