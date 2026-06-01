<script lang="ts">
    import { getContext } from 'svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    $: isCarouselSelected = !viewOnly && $selectedNode?.id === node.id

    const selectCarousel = (e: MouseEvent) => {
        if (viewOnly) return
        // only select the carousel if not clicking a slide (slides stop propagation)
        selectNode({ id: node.id, type: 'carousel', deleteId: node.id })
    }

    const selectSlide = (e: MouseEvent, slide: MomentNode) => {
        if (viewOnly) return
        e.stopPropagation()
        selectNode({ id: slide.id, type: 'image', deleteId: slide.id })
    }

    const COL_CLASS = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    } as const

    $: slides = node.children ?? []

    $: count = slides.length

    $: desktopCols = Math.min(node.columns ?? count, 4)

    $: gridClass = [
        COL_CLASS[Math.min(count, 2) as keyof typeof COL_CLASS] ?? COL_CLASS[2],
        `md:${COL_CLASS[desktopCols as keyof typeof COL_CLASS] ?? COL_CLASS[4]}`,
    ].join(' ')
</script>

{#if count === 3}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id={node.id}
         class="w-full space-y-2"
         style={node.css ?? ''}
         class:momenti-selected={isCarouselSelected}
         on:click={selectCarousel}
         on:keydown={() => {}}
    >
        <!-- wide slide -->
        <button type="button"
                data-nid={slides[0].id}
                class="w-full aspect-video overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60
                       {!viewOnly && $selectedNode?.id === slides[0].id ? 'momenti-selected' : ''}"
                on:click={(e) => selectSlide(e, slides[0])}>
            <img src={slides[0].src ?? ''}
                 alt={slides[0].alt ?? ''}
                 class="h-full w-full object-cover"
                 loading="lazy"/>
        </button>

        <!-- remaining slides -->
        <div class="grid grid-cols-2 gap-2">
            {#each slides.slice(1) as slide (slide.id)}
                <button type="button"
                        data-nid={slide.id}
                        class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60
                               {!viewOnly && $selectedNode?.id === slide.id ? 'momenti-selected' : ''}"
                        on:click={(e) => selectSlide(e, slide)}>
                    <img src={slide.src ?? ''}
                         alt={slide.alt ?? ''}
                         class="h-full w-full object-cover"
                         loading="lazy"/>
                </button>
            {/each}
        </div>
    </div>
{:else}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id={node.id}
         class={`grid w-full gap-2 ${gridClass}`}
         style={node.css ?? ''}
         class:momenti-selected={isCarouselSelected}
         on:click={selectCarousel}
         on:keydown={() => {}}
    >
        {#each slides as slide (slide.id)}
            <button type="button"
                    data-nid={slide.id}
                    class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60
                           {!viewOnly && $selectedNode?.id === slide.id ? 'momenti-selected' : ''}"
                    on:click={(e) => selectSlide(e, slide)}>
                <img src={slide.src ?? ''}
                     alt={slide.alt ?? ''}
                     class="h-full w-full object-cover"
                     loading="lazy"/>
            </button>
        {/each}
    </div>
{/if}