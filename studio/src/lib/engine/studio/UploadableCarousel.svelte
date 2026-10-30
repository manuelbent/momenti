<script lang="ts">
    import { updateNode } from '$lib/stores/momentContent'
    import { registerImage } from '$lib/utils/imageUpload'

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
    $: isGallery = node.layout === 'grid'
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

    let fileInputs: Record<string, HTMLInputElement> = {}

    let trackEl: HTMLDivElement

    function scrollByPage(dir: -1|1) {
        trackEl?.scrollBy({ left: dir * trackEl.clientWidth, behavior: 'smooth' })
    }

    function handleFileSelected(e: Event, slideId: string) {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        updateNode(slideId, { src: registerImage(file) });
        (e.target as HTMLInputElement).value = ''
    }

    function handleSlideClick(e: MouseEvent, slide: MomentNode) {
        e.stopPropagation()
        fileInputs[slide.id]?.click()
    }
</script>

{#if isGallery}
    <div id={node.id} data-nid={node.id} class="gallery-grid grid w-full gap-2"
         style={node.css ?? ''}
         style:--gallery-columns={Math.max(1, node.columns ?? Math.min(count, 3))}>
        {#each slides as slide (slide.id)}
            <figure class="min-w-0">
                <button type="button"
                        class="container relative w-full overflow-hidden rounded focus:outline-none cursor-pointer hover:outline-2 hover:outline-dashed hover:outline-white/60"
                        style:aspect-ratio={node.aspectRatio}
                        onclick={(e) => handleSlideClick(e, slide)}>
                    <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''}
                         alt={slide.alt ?? ''}
                         class="h-full w-full object-cover"
                         loading="lazy"/>
                </button>
                <input bind:this={fileInputs[slide.id]} type="file" accept="image/*"
                       onchange={(e) => handleFileSelected(e, slide.id)} hidden/>
                {#if slide.caption}
                    <figcaption>{slide.caption}</figcaption>
                {/if}
            </figure>
        {/each}
    </div>
{:else if isPaginated}
    <div id={node.id} data-nid={node.id} class="relative w-full" style={node.css ?? ''}>
        <div bind:this={trackEl}
             class="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
            {#each pages as page, p (p)}
                <div class="grid w-full shrink-0 snap-start grid-cols-2 gap-2">
                    {#each page as slide (slide.id)}
                        <button type="button"
                                class="container relative aspect-square overflow-hidden rounded focus:outline-none cursor-pointer hover:outline-2 hover:outline-dashed hover:outline-white/60"
                                onclick={(e) => handleSlideClick(e, slide)}>
                            <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover"
                                 loading="lazy"/>
                        </button>
                        <input bind:this={fileInputs[slide.id]} type="file" accept="image/*"
                               onchange={(e) => handleFileSelected(e, slide.id)} hidden/>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{:else if isWideSlideNeeded}
    <div id={node.id} data-nid={node.id} class="w-full space-y-2" style={node.css ?? ''}>
        <button type="button"
                class="w-full aspect-video overflow-hidden rounded focus:outline-none cursor-pointer hover:outline-2 hover:outline-dashed hover:outline-white/60"
                onclick={(e) => handleSlideClick(e, slides[0])}>
            <img id={slides[0].id} data-nid={slides[0].id} style={slides[0].css} src={slides[0].src ?? ''} alt={slides[0].alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
        </button>
        <input bind:this={fileInputs[slides[0].id]} type="file" accept="image/*"
               onchange={(e) => handleFileSelected(e, slides[0].id)} hidden/>

        <div class="grid grid-cols-2 gap-2">
            {#each slides.slice(1) as slide (slide.id)}
                <button type="button"
                        class="container aspect-square overflow-hidden rounded focus:outline-none cursor-pointer hover:outline-2 hover:outline-dashed hover:outline-white/60"
                        onclick={(e) => handleSlideClick(e, slide)}>
                    <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
                </button>
                <input bind:this={fileInputs[slide.id]} type="file" accept="image/*"
                       onchange={(e) => handleFileSelected(e, slide.id)} hidden/>
            {/each}
        </div>
    </div>
{:else}
    <div id={node.id} data-nid={node.id} class={`grid w-full gap-2 ${gridClass}`} style={node.css ?? ''}>
        {#each slides as slide (slide.id)}
            <button type="button"
                    class="container relative aspect-square overflow-hidden rounded focus:outline-none cursor-pointer hover:outline-2 hover:outline-dashed hover:outline-white/60"
                    onclick={(e) => handleSlideClick(e, slide)}>
                <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''} alt={slide.alt ?? ''} class="h-full w-full object-cover" loading="lazy"/>
            </button>
            <input bind:this={fileInputs[slide.id]} type="file" accept="image/*"
                   onchange={(e) => handleFileSelected(e, slide.id)} hidden/>
        {/each}
    </div>
{/if}

<style>
    .gallery-grid {
        grid-template-columns: minmax(0, 1fr);
    }

    @container moment (min-width: 28rem) {
        .gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }

    @container moment (min-width: 48rem) {
        .gallery-grid {
            grid-template-columns: repeat(var(--gallery-columns), minmax(0, 1fr));
        }
    }

    .container:hover::after {
        content: "UPLOAD NEW IMAGE";
        position: absolute;
        top: 4px;
        left: 4px;
        background: #fff;
        color: #000;
        font: 600 8px/1 sans-serif;
        letter-spacing: .05em;
        padding: 1px 4px;
        border-radius: 2px;
        pointer-events: none;
        z-index: 9;
    }
</style>
