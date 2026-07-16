export const loadFonts = (fonts: string[]|undefined): void => {
    if (!fonts) {
        return
    }

    fonts.forEach(name => {
        const id = `gfont-${name.replace(/\s+/g, '-').toLowerCase()}`
        if (document.getElementById(id)) return

        const link = document.createElement('link')
        link.id = id
        link.rel = 'stylesheet'
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(name)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap`
        document.head.appendChild(link)
    })
}
