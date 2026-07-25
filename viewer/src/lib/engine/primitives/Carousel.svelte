<script lang="ts">
    import { ChevronLeft, ChevronRight, X } from 'lucide-svelte'
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

    function scrollByPage(dir: -1 | 1) {
        trackEl?.scrollBy({ left: dir * trackEl.clientWidth, behavior: 'smooth' })
    }

    const open  = (i: number) => { lightboxIndex = i }
    const close = () => { lightboxIndex = null }

    const prev = () => {
        if (lightboxIndex === null) return
        lightboxIndex = (lightboxIndex - 1 + slides.length) % slides.length
    }
    const next = () => {
        if (lightboxIndex === null) return
        lightboxIndex = (lightboxIndex + 1) % slides.length
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

{#if isPaginated}
    <div class="relative w-full" style={node.css ?? ''}>
        <div bind:this={trackEl}
             class="flex w-full snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
            {#each pages as page, p (p)}
                <div class="grid w-full shrink-0 snap-start grid-cols-2 gap-2">
                    {#each page as slide (slide.id)}
                        <button type="button"
                                class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                                on:click={() => open(slides.indexOf(slide))}>
                            <img src={slide.src ?? ''}
                                 alt={slide.alt ?? ''}
                                 class="h-full w-full object-cover"
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
    <div class="w-full space-y-2" style={node.css ?? ''}>
        <!-- wide slide -->
        <button type="button"
                class="w-full aspect-video overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                on:click={() => open(0)}>
            <img src={slides[0].src ?? ''}
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
                    <img src={slide.src ?? ''}
                         alt={slide.alt ?? ''}
                         class="h-full w-full object-cover"
                         loading="lazy"/>
                </button>
            {/each}
        </div>
    </div>
{:else}
    <div class={`grid w-full gap-2 ${gridClass}`}
         style={node.css ?? ''}>
        {#each slides as slide (slide.id)}
            <button type="button"
                    class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60 cursor-pointer"
                    on:click={() => open(slides.indexOf(slide))}>
                <img src={slide.src ?? ''}
                     alt={slide.alt ?? ''}
                     class="h-full w-full object-cover"
                     loading="lazy"/>
            </button>
        {/each}
    </div>
{/if}

<!-- lightbox -->
{#if lightboxIndex !== null}
    <div
            class="fixed inset-0 z-1001 flex items-center justify-center bg-black/85 backdrop-blur-sm"
            on:click|self={close}
            on:keydown={() => {}}
            role="dialog"
            aria-modal="true"
            tabindex="-1"
    >
        <button class="absolute top-4 right-4 bg-black/40 rounded-full p-1 cursor-pointer" on:click={close} aria-label="Close">
            <X size={18} />
        </button>

        {#if slides.length > 1}
            <button class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-1 cursor-pointer" on:click={prev} aria-label="Previous">
                <ChevronLeft size={18} />
            </button>
            <button class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 rounded-full p-1 cursor-pointer" on:click={next} aria-label="Next">
                <ChevronRight size={18} />
            </button>
        {/if}

        {#if slides[lightboxIndex].type === 'image'}
            <img
                    src={slides[lightboxIndex].src ?? ''}
                    alt={slides[lightboxIndex].alt ?? ''}
                    class="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
            />
        {:else if slides[lightboxIndex].html}
            <div class="max-w-[90vw] max-h-[90vh] overflow-auto">{@html slides[lightboxIndex].html}</div>
        {/if}

        <div class="absolute bottom-4 text-xs">{lightboxIndex + 1} / {slides.length}</div>
    </div>
{/if}