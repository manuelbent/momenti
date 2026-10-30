<script lang="ts">
    import { onDestroy } from 'svelte'

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

    let lightboxIndex: number | null = null

    let trackEl: HTMLDivElement

    const open  = (i: number) => { lightboxIndex = i }
    const close = () => { lightboxIndex = null }

    function openDialog(dialog: HTMLDialogElement) {
        dialog.showModal()
        return { destroy: () => dialog.close() }
    }

    const prev = () => {
        if (lightboxIndex === null) return
        lightboxIndex = (lightboxIndex - 1 + slides.length) % slides.length
    }
    const next = () => {
        if (lightboxIndex === null) return
        lightboxIndex = (lightboxIndex + 1) % slides.length
    }

    const onImageTap = (e: MouseEvent) => {
        if (slides.length <= 1) return
        const { left, width } = (e.currentTarget as HTMLElement).getBoundingClientRect()
        if (e.clientX - left < width / 2) prev()
        else next()
    }

    const onKeydown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') close()
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
    }

    $: if (typeof document !== 'undefined') {
        document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    }

    onDestroy(() => {
        if (typeof document !== 'undefined') document.body.style.overflow = ''
    })
</script>

<svelte:window on:keydown={onKeydown} />

{#if isGallery}
    <div id={node.id} data-nid={node.id} class="gallery-grid grid w-full gap-2"
         style={node.css ?? ''}
         style:--gallery-columns={Math.max(1, node.columns ?? Math.min(count, 3))}>
        {#each slides as slide (slide.id)}
            <figure class="min-w-0">
                <button type="button"
                        class="w-full overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                        style:aspect-ratio={node.aspectRatio}
                        on:click={() => open(slides.indexOf(slide))}>
                    <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''}
                         alt={slide.alt ?? ''}
                         class="h-full w-full object-cover"
                         loading="lazy"/>
                </button>
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
                                class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                                on:click={() => open(slides.indexOf(slide))}>
                            <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''}
                                 alt={slide.alt ?? ''}
                                 class="h-full w-full object-cover"
                                 loading="lazy"/>
                        </button>
                    {/each}
                </div>
            {/each}
        </div>
    </div>
{:else if isWideSlideNeeded}
    <div id={node.id} data-nid={node.id} class="w-full space-y-2" style={node.css ?? ''}>
        <!-- wide slide -->
        <button type="button"
                class="w-full aspect-video overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                on:click={() => open(0)}>
            <img id={slides[0].id} data-nid={slides[0].id} style={slides[0].css} src={slides[0].src ?? ''}
                 alt={slides[0].alt ?? ''}
                 class="h-full w-full object-cover"
                 loading="lazy"/>
        </button>

        <!-- remaining slides -->
        <div class="grid grid-cols-2 gap-2">
            {#each slides.slice(1) as slide (slide.id)}
                <button type="button"
                        class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                        on:click={() => open(slides.indexOf(slide))}>
                    <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''}
                         alt={slide.alt ?? ''}
                         class="h-full w-full object-cover"
                         loading="lazy"/>
                </button>
            {/each}
        </div>
    </div>
{:else}
    <div id={node.id} data-nid={node.id} class={`grid w-full gap-2 ${gridClass}`}
         style={node.css ?? ''}>
        {#each slides as slide (slide.id)}
            <button type="button"
                    class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                    on:click={() => open(slides.indexOf(slide))}>
                <img id={slide.id} data-nid={slide.id} style={slide.css} src={slide.src ?? ''}
                     alt={slide.alt ?? ''}
                     class="h-full w-full object-cover"
                     loading="lazy"/>
            </button>
        {/each}
    </div>
{/if}

<!-- lightbox -->
{#if lightboxIndex !== null}
    <dialog
            use:openDialog
            class="fixed inset-0 m-0 h-full w-full max-h-none max-w-none border-0 p-0 z-1001 flex items-center justify-center bg-black/85 backdrop-blur-sm"
            on:click|self={close}
            on:keydown={() => {}}
            aria-modal="true"
            tabindex="-1"
    >
        {#if slides[lightboxIndex].type === 'image'}
            <button
                    type="button"
                    class="block cursor-default"
                    on:click|stopPropagation={onImageTap}
                    aria-label={slides.length > 1 ? 'Tap left or right to navigate' : undefined}
            >
                <img
                        src={slides[lightboxIndex].src ?? ''}
                        alt={slides[lightboxIndex].alt ?? ''}
                        class="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl {slides.length > 1 ? 'cursor-pointer' : ''}"
                />
            </button>
        {:else if slides[lightboxIndex].html}
            <div class="max-w-[90vw] max-h-[90vh] overflow-auto">{@html slides[lightboxIndex].html}</div>
        {/if}

        <div class="absolute bottom-4 text-xs">{lightboxIndex + 1} / {slides.length}</div>
    </dialog>
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
</style>