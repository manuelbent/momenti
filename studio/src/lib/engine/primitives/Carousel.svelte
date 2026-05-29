<script lang="ts">
    import { ChevronLeft, ChevronRight, X } from 'lucide-svelte'

    export let node: MomentNode

    const slides = node.children ?? []

    let lightboxIndex: number | null = null

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
</script>

<svelte:window on:keydown={onKeydown} />

<!-- Grid -->
<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full" style={node.css ?? ''}>
    {#each slides as slide, i (slide.id)}
        <button
            class="aspect-square overflow-hidden rounded cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
            on:click={() => open(i)}
            aria-label="Open image {i + 1}"
        >
            {#if slide.type === 'image'}
                <img src={slide.src ?? ''} alt={slide.alt ?? ''} class="w-full h-full object-cover transition-transform duration-200 hover:scale-105" />
            {:else if slide.html}
                <!-- eslint-disable-next-line svelte/no-at-html-tags -->
                <div class="w-full h-full">{@html slide.html}</div>
            {/if}
        </button>
    {/each}
</div>

<!-- Lightbox -->
{#if lightboxIndex !== null}
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <!-- svelte-ignore a11y-interactive-supports-focus -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm"
        on:click|self={close}
        on:keydown={() => {}}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
    >
        <button class="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 transition-colors" on:click={close} aria-label="Close">
            <X size={24} />
        </button>

        {#if slides.length > 1}
            <button class="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 transition-colors" on:click={prev} aria-label="Previous">
                <ChevronLeft size={32} />
            </button>
            <button class="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/40 hover:bg-black/70 rounded-full p-1 transition-colors" on:click={next} aria-label="Next">
                <ChevronRight size={32} />
            </button>
        {/if}

        {#if slides[lightboxIndex].type === 'image'}
            <img
                src={slides[lightboxIndex].src ?? ''}
                alt={slides[lightboxIndex].alt ?? ''}
                class="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-2xl"
            />
        {:else if slides[lightboxIndex].html}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            <div class="max-w-[90vw] max-h-[90vh] overflow-auto">{@html slides[lightboxIndex].html}</div>
        {/if}

        <div class="absolute bottom-4 text-white/60 text-sm">{lightboxIndex + 1} / {slides.length}</div>
    </div>
{/if}
