const NODE_TYPES = new Set<MomentNode['type']>([
    'box',
    'text',
    'image',
    'form',
    'map',
    'countdown',
    'link',
    'navbar',
    'footer',
    'carousel',
])

interface ParsedValue {
    value: unknown
}

class PartialJsonParser {
    private index = 0

    constructor(private readonly input: string) {}

    parse(): unknown {
        this.skipWhitespace()
        return this.parseValue()?.value
    }

    private parseValue(): ParsedValue|undefined {
        this.skipWhitespace()
        const char = this.input[this.index]

        if (char === '{') return { value: this.parseObject() }
        if (char === '[') return { value: this.parseArray() }
        if (char === '"') return { value: this.parseString().value }

        const remainder = this.input.slice(this.index)
        const literal = /^(true|false|null)\b/.exec(remainder)
        if (literal) {
            this.index += literal[0].length
            return { value: JSON.parse(literal[0]) }
        }

        const number = /^-?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+-]?\d*)?/.exec(remainder)
        if (number?.[0] && number[0] !== '-') {
            this.index += number[0].length
            return { value: Number(number[0]) }
        }

        return undefined
    }

    private parseObject(): Record<string, unknown> {
        const result: Record<string, unknown> = {}
        this.index++

        while (this.index < this.input.length) {
            this.skipWhitespace()
            if (this.input[this.index] === '}') {
                this.index++
                break
            }
            if (this.input[this.index] === ',') {
                this.index++
                continue
            }
            if (this.input[this.index] !== '"') break

            const key = this.parseString()
            if (!key.complete) break

            this.skipWhitespace()
            if (this.input[this.index] !== ':') break
            this.index++

            const parsed = this.parseValue()
            if (!parsed) break
            result[key.value] = parsed.value
        }

        return result
    }

    private parseArray(): unknown[] {
        const result: unknown[] = []
        this.index++

        while (this.index < this.input.length) {
            this.skipWhitespace()
            if (this.input[this.index] === ']') {
                this.index++
                break
            }
            if (this.input[this.index] === ',') {
                this.index++
                continue
            }

            const parsed = this.parseValue()
            if (!parsed) break
            result.push(parsed.value)
        }

        return result
    }

    private parseString(): { value: string; complete: boolean } {
        let value = ''
        this.index++

        while (this.index < this.input.length) {
            const char = this.input[this.index++]
            if (char === '"') return { value, complete: true }
            if (char !== '\\') {
                value += char
                continue
            }

            if (this.index >= this.input.length) break
            const escaped = this.input[this.index++]
            const escapes: Record<string, string> = {
                '"': '"',
                '\\': '\\',
                '/': '/',
                b: '\b',
                f: '\f',
                n: '\n',
                r: '\r',
                t: '\t',
            }

            if (escaped === 'u') {
                const hex = this.input.slice(this.index, this.index + 4)
                if (!/^[\da-fA-F]{4}$/.test(hex)) break
                value += String.fromCharCode(parseInt(hex, 16))
                this.index += 4
            } else {
                value += escapes[escaped] ?? escaped
            }
        }

        return { value, complete: false }
    }

    private skipWhitespace(): void {
        while (/\s/.test(this.input[this.index] ?? '')) this.index++
    }
}

const sanitizeNode = (value: unknown): MomentNode|null => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null

    const node = value as Partial<MomentNode>
    if (typeof node.id !== 'string' || !NODE_TYPES.has(node.type as MomentNode['type'])) return null

    const children = Array.isArray(node.children)
        ? node.children.map(sanitizeNode).filter((child): child is MomentNode => child !== null)
        : undefined

    return {
        ...node,
        type: node.type as MomentNode['type'],
        id: node.id,
        ...(children ? { children } : {}),
    }
}

export const parseStreamingMoment = (text: string): Partial<MomentContent>|null => {
    if (!text.trim()) return null

    try {
        const parsed = new PartialJsonParser(text).parse()
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null

        const content = parsed as Partial<MomentContent>
        const root = sanitizeNode(content.root)
        return {
            ...(typeof content.slug === 'string' ? { slug: content.slug } : {}),
            ...(Array.isArray(content.fonts)
                ? { fonts: content.fonts.filter((font): font is string => typeof font === 'string') }
                : {}),
            ...(root ? { root } : {}),
        }
    } catch {
        return null
    }
}
