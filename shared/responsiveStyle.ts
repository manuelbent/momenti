interface ResponsiveStyles {
    css?: string;
    mobileCss?: string;
}

const MOBILE_WIDTH = 640

export const layoutStyle = (layout?: 'row'|'column'|'grid', columns?: number) => {
    if (layout === 'column') {
        return 'display:flex;flex-direction:column;'
    }
    if (layout === 'row') {
        return 'display:flex;flex-direction:row;'
    }
    if (layout === 'grid') {
        const count = Math.max(1, Math.min(columns ?? 2, 4))
        return `display:grid;grid-template-columns:repeat(${count},minmax(0,1fr));`
    }
    return ''
}

export const mobileLayoutStyle = (layout?: 'row'|'column'|'grid') => {
    if (layout === 'column') {
        return 'display:flex;flex-direction:column;grid-template-columns:minmax(0,1fr);align-items:stretch;'
    }
    if (layout === 'row') {
        return 'display:flex;flex-direction:row;'
    }
    if (layout === 'grid') {
        return 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));'
    }
    return ''
}

export const responsiveStyle = (element: HTMLElement, initial: ResponsiveStyles) => {
    let styles = initial
    let viewport = element.closest<HTMLElement>('[data-moment-viewport]') ?? document.documentElement

    const apply = () => {
        const isMobile = viewport.clientWidth <= MOBILE_WIDTH
        element.style.cssText = [styles.css, isMobile ? styles.mobileCss : undefined]
            .filter(Boolean)
            .join(';')
    }

    const observer = new ResizeObserver(apply)
    observer.observe(viewport)
    apply()

    return {
        update(next: ResponsiveStyles) {
            styles = next
            const nextViewport = element.closest<HTMLElement>('[data-moment-viewport]') ?? document.documentElement
            if (nextViewport !== viewport) {
                observer.unobserve(viewport)
                viewport = nextViewport
                observer.observe(viewport)
            }
            apply()
        },
        destroy() {
            observer.disconnect()
        },
    }
}
