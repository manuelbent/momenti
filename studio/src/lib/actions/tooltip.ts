/**
 * Svelte action that appends a lightweight tooltip to <body> and positions it
 * above the target element on mouseenter / mouseleave.
 *
 * Usage:  <div use:tooltip={"My label"}>
 */
export function tooltip(el: HTMLElement, label: string) {
    const tip = document.createElement('div')
    tip.textContent = label
    tip.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        background:#fff; color:#000; font:400 8px/1 sans-serif;
        text-transform:uppercase; letter-spacing:.05em;
        padding:1px 3px; border-radius:2px;
        opacity:0; transition:opacity .15s, transform .15s;
        transform:translateY(-4px);
        white-space:nowrap;
    `
    document.body.appendChild(tip)

    function show() {
        const r = el.getBoundingClientRect()
        tip.style.left = (r.left + 4) + 'px'
        tip.style.top  = (r.top + 4) + 'px'
        tip.style.opacity = '1'
        tip.style.transform = 'translateY(0)'
    }

    function hide() {
        tip.style.opacity = '0'
        tip.style.transform = 'translateY(-4px)'
    }

    el.addEventListener('mouseenter', show)
    el.addEventListener('mouseleave', hide)

    return {
        update(newLabel: string) {
            tip.textContent = newLabel
        },
        destroy() {
            el.removeEventListener('mouseenter', show)
            el.removeEventListener('mouseleave', hide)
            tip.remove()
        }
    }
}

