export const parseCss = (css: string): Record<string, string> => {
    const map: Record<string, string> = {}
    for (const decl of (css ?? '').split(';')) {
        const idx = decl.indexOf(':')
        if (idx === -1) continue
        const key = decl.slice(0, idx).trim()
        const val = decl.slice(idx + 1).trim()
        if (key) map[key] = val
    }
    return map
}

export const stringifyCss = (map: Record<string, string>): string =>
    Object.entries(map).filter(([, v]) => v !== '').map(([k, v]) => `${k}: ${v}`).join('; ')

export const setCssProp = (css: string, prop: string, value: string): string => {
    const map = parseCss(css)
    if (value === '') delete map[prop]
    else map[prop] = value
    return stringifyCss(map)
}

