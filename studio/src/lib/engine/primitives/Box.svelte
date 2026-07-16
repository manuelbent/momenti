<script lang="ts">
    import { onMount } from 'svelte'

    export let node: MomentNode

    let element: HTMLDivElement
    let isVisible = !node.animation

    $: delay = Math.max(0, Math.min(node.animationDelay ?? 0, 1200))
    $: style = `${node.css ?? ''};container-type:inline-size;--moment-delay:${delay}ms;`

    onMount(() => {
        if (!node.animation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            isVisible = true
            return
        }

        const observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) return
            isVisible = true
            observer.disconnect()
        }, { threshold: 0.12 })

        observer.observe(element)
        return () => observer.disconnect()
    })
</script>

<div
    bind:this={element}
    id={node.id}
    data-nid={node.id}
    data-animation={node.animation}
    data-mobile-layout={node.mobileLayout}
    class:moment-reveal={Boolean(node.animation)}
    class:is-visible={isVisible}
    {style}>
    <slot/>
</div>

<style>
    .moment-reveal {
        opacity: 0;
        transition:
            opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
            transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
        transition-delay: var(--moment-delay);
        will-change: opacity, transform;
    }

    .moment-reveal[data-animation='fade-up'] {
        transform: translateY(2rem);
    }

    .moment-reveal[data-animation='scale-in'] {
        transform: scale(0.96);
    }

    .moment-reveal[data-animation='slide-right'] {
        transform: translateX(-2rem);
    }

    .moment-reveal.is-visible {
        opacity: 1;
        transform: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .moment-reveal {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }

    @media (max-width: 640px) {
        div[data-mobile-layout='column'] {
            display: flex !important;
            flex-direction: column !important;
            grid-template-columns: minmax(0, 1fr) !important;
            align-items: stretch !important;
        }

        div[data-mobile-layout='row'] {
            display: flex !important;
            flex-direction: row !important;
        }

        div[data-mobile-layout='grid'] {
            display: grid !important;
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
    }
</style>
