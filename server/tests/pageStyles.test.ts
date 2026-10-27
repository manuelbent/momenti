import { describe, expect, it } from 'vitest'
import { scopePageStyles } from '../../shared/pageStyles'
import { parseStreamingMoment } from '../../studio/src/lib/utils/parseStreamingMoment'

describe('page styles', () => {
    it('scopes every selector without splitting commas inside selectors or strings', () => {
        expect(scopePageStyles(`
            #title, :is(h1, h2), [data-label="a,b"]::before { color: red }
        `, 'page-one')).toBe(
            ':where([data-moment-page="page-one"]) #title,' +
            ':where([data-moment-page="page-one"]) :is(h1,h2),' +
            ':where([data-moment-page="page-one"]) [data-label="a,b"]::before{color:red}',
        )
    })

    it('scopes nested conditional rules while retaining page-based breakpoints', () => {
        const css = scopePageStyles(`
            @supports (display: grid) {
                @container moment (max-width: 40rem) {
                    #opening { display: grid; grid-template-columns: 1fr }
                }
            }
            @media (prefers-reduced-motion: reduce) {
                #opening * { transition: none }
            }
        `, 'mobile')
        expect(css).toContain('@container moment (max-width:40rem)')
        expect(css).toContain(':where([data-moment-page="mobile"]) #opening{')
        expect(css).toContain(':where([data-moment-page="mobile"]) #opening *{')
    })

    it('preserves expressive CSS and local pseudo-elements', () => {
        const css = scopePageStyles(`
            #root { --accent: oklch(70% .15 30); color: var(--accent) }
            #title { font-size: clamp(2rem, 9cqw, 8rem); max-width: 12ch }
            #title::before { content: "A night to remember"; position: absolute }
            #rsvp button:focus-visible { outline: 2px solid currentColor }
        `, 'editorial')
        expect(css).toContain('--accent:oklch(70%.15 30)')
        expect(css).toContain('max-width:12ch')
        expect(css).toContain('#title::before')
        expect(css).toContain('#rsvp button:focus-visible')
    })

    it.each([
        '@import "https://example.com/style.css";',
        '@font-face { font-family: custom; src: url(https://example.com/font.woff) }',
        '@keyframes pulse { to { opacity: 0 } }',
        '@property --global { syntax: "<color>"; inherits: true; initial-value: red }',
        '#image { background: url(https://example.com/track) }',
        '#image { --asset: url(https://example.com/track) }',
        '#image { background: image-set("https://example.com/track" 1x) }',
        '#image { background: u\\72l("https://example.com/track") }',
        '#image { background: i\\6d age-set("https://example.com/track" 1x) }',
        '#root { & h1 { color: red } }',
        '#root { color: red; invalid CSS! }',
    ])('rejects unsupported or resource-loading CSS: %s', css => {
        expect(() => scopePageStyles(css, 'safe')).toThrow()
    })

    it('uses different scopes for copies of the same moment', () => {
        const css = '#title { color: red }'
        expect(scopePageStyles(css, 'first')).not.toBe(scopePageStyles(css, 'second'))
    })

    it('rejects invalid scopes and oversized stylesheets', () => {
        expect(() => scopePageStyles('', '"] body, [id="')).toThrow('Invalid page style scope')
        expect(() => scopePageStyles(' '.repeat(100_001), 'page')).toThrow('100,000')
    })
})

describe('streaming page styles', () => {
    const stylesheet = '#title::before { content: "Hello"; }'

    it('does not expose an incomplete CSS string', () => {
        const partial = '{"stylesheet":' + JSON.stringify(stylesheet).slice(0, -1)
        expect(parseStreamingMoment(partial)).not.toHaveProperty('stylesheet')
    })

    it('exposes complete styles before the root starts streaming', () => {
        expect(parseStreamingMoment('{"stylesheet":' + JSON.stringify(stylesheet) + ','))
            .toEqual({ stylesheet })
    })

    it('retains styles with an incomplete node tree', () => {
        const partial = '{"stylesheet":' + JSON.stringify(stylesheet)
            + ',"root":{"id":"root","type":"box","children":[{"id":"title","type":"text","html":"Hel'
        expect(parseStreamingMoment(partial)).toEqual({
            stylesheet,
            root: {
                id: 'root',
                type: 'box',
                children: [{ id: 'title', type: 'text', html: 'Hel' }],
            },
        })
    })

    it('preserves legacy pages without injecting a stylesheet', () => {
        const content = { slug: 'legacy', root: { id: 'root', type: 'box', css: 'color:red' } }
        expect(parseStreamingMoment(JSON.stringify(content))).toEqual(content)
    })
})
