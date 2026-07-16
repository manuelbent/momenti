<script lang="ts">
    import { onMount } from 'svelte'
    import { layoutStyle, mobileLayoutStyle, responsiveStyle } from '$shared/responsiveStyle'
    import { selectedSection } from '$lib/stores/section'
    import { sidebarMode } from '$lib/stores/sidebarMode'

    export let node: MomentNode

    let element: HTMLDivElement
    let isVisible = !node.animation

    // only sections (hero and section) can be selected, and only in changes mode
    $: isSection = ['hero', 'section'].includes(node.variant!)
    $: isChangesMode = $sidebarMode === 'changes'
    $: isSelected = isSection && isChangesMode && $selectedSection?.id === node.id
    $: delay = Math.max(0, Math.min(node.animationDelay ?? 0, 1200))
    $: baseCss = `box-sizing:border-box;min-width:0;${layoutStyle(node.layout, node.columns)}${node.css ?? ''};--moment-delay:${delay}ms;`
    $: mobileCss = `${mobileLayoutStyle(node.mobileLayout)}${node.mobileCss ?? ''}`

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

    function handleClick() {
        if (!isSection || !isChangesMode) {
            return
        }

        selectedSection.set($selectedSection?.id === node.id ? null : node)
    }
</script>

<div bind:this={element}
     id={node.id}
     data-nid={node.id}
     data-label={node.id}
     data-animation={node.animation}
     data-mobile-layout={node.mobileLayout}
     use:responsiveStyle={{ css: baseCss, mobileCss }}
     class:selectable={isSection && isChangesMode}
     class:selected={isSelected}
     class:moment-reveal={Boolean(node.animation)}
     class:is-visible={isVisible}
     onclick={handleClick}
     role="presentation"
>
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

</style>
