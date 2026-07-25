<script lang="ts">
    export let node: MomentNode

    const COL_CLASS = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    } as const

    const PAGE_SIZE = 2

    $: slides = node.children ?? []
    $: count = slides.length
    $: isPaginated = count > PAGE_SIZE
    $: pages = isPaginated
        ? Array.from({ length: Math.ceil(count / PAGE_SIZE) }, (_, i) =>
            slides.slice(i * PAGE_SIZE, i * PAGE_SIZE + PAGE_SIZE))
        : [slides]
    $: isWideSlideNeeded = count >= 3 && count % 2 === 1
    $: desktopCols = Math.min(node.columns ?? count, 4)
    $: gridClass = [
        COL_CLASS[Math.min(count, 2) as keyof typeof COL_CLASS] ?? COL_CLASS[2],
        `md:${COL_CLASS[desktopCols as keyof typeof COL_CLASS] ?? COL_CLASS[4]}`,
    ].join(' ')

    let trackEl: HTMLDivElement
</script>

{#if isPaginated}
    <div id={node.id} data-nid={node.id} class="relative w-full" style={node.css ?? ''}>
        <div bind:this={trackEl}
             class="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
            {#each pages as page, p (p)}
                <div class="grid w-full shrink-0 snap-start grid-cols-2 gap-2">
                    {#each page as slide (slide.id)}
                        <button type="button"
                                class="aspect-square overflow-hidden rounded cursor-default focus:outline-none">
                            <img src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover"
                                 loading="lazy"/>
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{:else if isWideSlideNeeded}
    <div id={node.id} data-nid={node.id} class="w-full space-y-2" style={node.css ?? ''}>
        <button type="button" class="w-full aspect-video overflow-hidden rounded cursor-default focus:outline-none">
            <img src={slides[0].src ?? ''} alt={slides[0].alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
        </button>
        <div class="grid grid-cols-2 gap-2">
            {#each slides.slice(1) as slide (slide.id)}
                <button type="button" class="aspect-square overflow-hidden rounded cursor-default focus:outline-none">
                    <img src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
                </button>
            {/each}
        </div>
    </div>
{:else}
    <div id={node.id} data-nid={node.id} class={`grid w-full gap-2 ${gridClass}`} style={node.css ?? ''}>
        {#each slides as slide (slide.id)}
            <button type="button" class="aspect-square overflow-hidden rounded cursor-default focus:outline-none">
                <img src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
            </button>
        {/each}
    </div>
{/if}