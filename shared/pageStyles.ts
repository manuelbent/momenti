import { generate, ident, parse, walk } from 'css-tree'
import type { CssNode, List } from 'css-tree'

const GROUP_RULES = new Set(['container', 'media', 'supports'])
const RESOURCE_FUNCTIONS = new Set(['url', 'image', 'image-set', '-webkit-image-set', 'src'])

export const PAGE_BASE_STYLES = `
    :where([data-layout="row"]) {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    :where([data-layout="column"]) {
        display: flex;
        flex-direction: column;
    }
    :where([data-layout="grid"]) {
        display: grid;
        grid-template-columns: repeat(var(--moment-columns, 2), minmax(0, 1fr));
    }
    :where(img) { max-width: 100%; }
`

/**
 * Scope selectors structurally, including lists and conditional rules. Generated
 * CSS cannot style the page boundary or register document-wide resources.
 */
export function scopePageStyles(stylesheet: string, scope: string): string {
    if (!/^[a-zA-Z0-9-]+$/.test(scope)) {
        throw new Error('Invalid page style scope.')
    }
    if (stylesheet.length > 100_000) {
        throw new Error('Page stylesheet exceeds 100,000 characters.')
    }

    const tree = parse(stylesheet, {
        parseCustomProperty: true,
        onParseError(error) { throw error },
    })
    if (tree.type !== 'StyleSheet') {
        throw new Error('Expected a page stylesheet.')
    }

    walk(tree, node => {
        if (node.type === 'Raw') {
            throw new Error('Unsupported or malformed page CSS.')
        }
        if (node.type === 'Url' || (node.type === 'Function'
            && RESOURCE_FUNCTIONS.has(ident.decode(node.name).toLowerCase()))) {
            throw new Error('Use image nodes and the fonts array instead of CSS resource URLs.')
        }
    })

    const prefix = `:where([data-moment-page="${scope}"])`
    const scopeRules = (rules: List<CssNode>): void => {
        rules.forEach(rule => {
            if (rule.type === 'Atrule') {
                if (!GROUP_RULES.has(ident.decode(rule.name).toLowerCase()) || !rule.block) {
                    throw new Error('Page CSS supports only @container, @media and @supports rules.')
                }
                scopeRules(rule.block.children)
                return
            }
            if (rule.type !== 'Rule' || rule.prelude.type !== 'SelectorList'
                || rule.block.children.some(child => child.type !== 'Declaration')) {
                throw new Error('Use flat CSS selectors, with responsive rules in @container blocks.')
            }
            const selectors = rule.prelude.children.toArray().map(selector => {
                if (selector.type !== 'Selector' || selector.children.first?.type === 'Combinator') {
                    throw new Error('Page CSS requires complete selectors.')
                }
                return `${prefix} ${generate(selector)}`
            })
            const scopedSelectors = parse(selectors.join(','), { context: 'selectorList' })
            if (scopedSelectors.type !== 'SelectorList') {
                throw new Error('Invalid page CSS selectors.')
            }
            rule.prelude = scopedSelectors
        })
    }
    scopeRules(tree.children)
    return generate(tree)
}
