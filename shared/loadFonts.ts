export const loadFonts = async (fonts: string[]|undefined): Promise<void> => {
    if (!fonts) {
        return
    }

    if (!fonts.length) {
        return
    }

    // 1. inject each stylesheet and wait for it to load so that all
    // @font-face rules are registered before we ask document.fonts.ready
    await Promise.all(fonts.map(name => new Promise<void>(resolve => {
        const id = `gfont-${name.replace(/\s+/g, '-').toLowerCase()}`

        if (document.getElementById(id)) {
            resolve()
            return
        }

        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap`
        link.onload = () => resolve()
        link.onerror = () => resolve()
        document.head.appendChild(link)
    })))

    // 2. find every FontFace the stylesheets just registered and load them explicitly.
    // document.fonts.ready alone won't trigger downloads because no DOM elements exist yet.
    await Promise.all(
        [...document.fonts]
            .filter(face => fonts.includes(face.family.replace(/^"|"$/g, '')))
            .map(face => face.load().catch(() => {}))
    )
}

