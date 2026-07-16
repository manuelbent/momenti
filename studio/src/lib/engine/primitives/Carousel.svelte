<script lang="ts">
    import { ChevronLeft, ChevronRight } from 'lucide-svelte'

    export let node: MomentNode

    const COL_CLASS = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    } as const

    const PAGE_SIZE = 2
    const ASPECT_RATIO = {
        square: '1 / 1',
        portrait: '3 / 4',
        landscape: '4 / 3',
        wide: '16 / 9',
    } as const

    $: slides = node.children ?? []
    $: slideAspectRatio = ASPECT_RATIO[node.aspectRatio ?? 'square']
    $: featuredAspectRatio = node.aspectRatio ? slideAspectRatio : ASPECT_RATIO.wide
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

    function scrollByPage(dir: -1|1) {
        trackEl?.scrollBy({ left: dir * trackEl.clientWidth, behavior: 'smooth' })
    }
</script>

{#if isPaginated}
    <div id={node.id} data-nid={node.id} class="relative w-full" style={node.css ?? ''}>
        <div bind:this={trackEl}
             class="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
            {#each pages as page, p (p)}
                <div class="grid w-full shrink-0 snap-start grid-cols-2 gap-2">
                    {#each page as slide (slide.id)}
                        <button type="button"
                                class="overflow-hidden rounded cursor-default focus:outline-none"
                                style={`aspect-ratio:${slideAspectRatio};`}>
                            <img src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover"
                                 loading="lazy"/>
                        </button>
                    {/each}
                </div>
            {/each}
        </div>

        <button type="button" aria-label="Previous"
                class="absolute left-1 top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full bg-black/45 p-1 cursor-pointer hover:bg-black/65"
                on:click={() => scrollByPage(-1)}>
            <ChevronLeft size={18}/>
        </button>
        <button type="button" aria-label="Next"
                class="absolute right-1 top-1/2 z-10 grid -translate-y-1/2 place-items-center rounded-full bg-black/45 p-1 cursor-pointer hover:bg-black/65"
                on:click={() => scrollByPage(1)}>
            <ChevronRight size={18}/>
        </button>
    </div>
{:else if isWideSlideNeeded}
    <div id={node.id} data-nid={node.id} class="w-full space-y-2" style={node.css ?? ''}>
        <button type="button" class="w-full overflow-hidden rounded cursor-default focus:outline-none"
                style={`aspect-ratio:${featuredAspectRatio};`}>
            <img src={slides[0].src ?? ''} alt={slides[0].alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
        </button>
        <div class="grid grid-cols-2 gap-2">
            {#each slides.slice(1) as slide (slide.id)}
                <button type="button" class="overflow-hidden rounded cursor-default focus:outline-none"
                        style={`aspect-ratio:${slideAspectRatio};`}>
                    <img src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
                </button>
            {/each}
        </div>
    </div>
{:else}
    <div id={node.id} data-nid={node.id} class={`grid w-full gap-2 ${gridClass}`} style={node.css ?? ''}>
        {#each slides as slide (slide.id)}
            <button type="button" class="overflow-hidden rounded cursor-default focus:outline-none"
                    style={`aspect-ratio:${slideAspectRatio};`}>
                <img src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
            </button>
        {/each}
    </div>
{/if}