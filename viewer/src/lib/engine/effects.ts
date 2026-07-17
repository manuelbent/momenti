const PRESETS: Record<string, Keyframe[]> = {
    'fade-in':     [{ opacity: 0 }, { opacity: 1 }],
    'slide-up':    [{ opacity: 0, transform: 'translateY(40px)' }, { opacity: 1, transform: 'none' }],
    'slide-left':  [{ opacity: 0, transform: 'translateX(40px)' }, { opacity: 1, transform: 'none' }],
    'slide-right': [{ opacity: 0, transform: 'translateX(-40px)' }, { opacity: 1, transform: 'none' }],
    'scale-in':    [{ opacity: 0, transform: 'scale(.9)' }, { opacity: 1, transform: 'scale(1)' }],
    'float':       [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }],
    'pulse':       [{ transform: 'scale(1)' }, { transform: 'scale(1.05)' }, { transform: 'scale(1)' }],
}

/**
 * Svelte action that applies declarative entrance/idle animations to a node.
 * Attach to a `display:contents` wrapper; it animates the wrapper's first
 * element child (the actual primitive box) via the Web Animations API.
 * View-triggered effects fire once when the element scrolls into view.
 */
export function effects(wrapper: HTMLElement, list: NodeEffect[] = []) {
    const el = wrapper.firstElementChild as HTMLElement|null
    if (!el || !list.length) return

    const run = (e: NodeEffect) => {
        const kf = PRESETS[e.type]
        if (!kf) return
        const loop = e.on === 'always'
        el.animate(kf, {
            duration: e.duration ?? (loop ? 3000 : 700),
            delay: e.delay ?? 0,
            easing: 'ease-out',
            iterations: loop ? Infinity : 1,
            fill: loop ? 'none' : 'both',
        })
    }

    const view = list.filter(e => (e.on ?? 'view') === 'view')
    const now = list.filter(e => e.on === 'load' || e.on === 'always')

    now.forEach(run)

    if (!view.length) return

    el.style.opacity = '0'
    const io = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
            view.forEach(run)
            obs.disconnect()
        }
    }, { threshold: 0.15 })
    io.observe(el)

    return { destroy: () => io.disconnect() }
}
