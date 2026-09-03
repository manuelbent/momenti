import { describe, expect, it } from 'vitest'
import { parse } from './momentContentParser'

describe('extractMomentContentText', () => {
    it('extracts HTML from nested text nodes', () => {
        const content: MomentContent = {
            slug: 'summer-party',
            root: {
                id: 'root',
                type: 'box',
                children: [
                    {
                        id: 'title',
                        type: 'text',
                        html: '<h1>Summer <strong>party</strong></h1>',
                    },
                    {
                        id: 'form',
                        type: 'form',
                        buttonLabel: 'Register',
                    },
                ],
            },
        }

        expect(parse(content)).toBe('Summer party')
    })

    it('excludes fields that cannot be changed by the text editor', () => {
        const content: MomentContent = {
            slug: 'ignored-slug',
            root: {
                id: 'root',
                type: 'image',
                alt: 'Event banner',
                src: 'https://example.com/image.jpg',
                href: 'https://example.com',
                css: 'color: red',
            },
        }

        expect(parse(content)).toBe('')
    })
})
