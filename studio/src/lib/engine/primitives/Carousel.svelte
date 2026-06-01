<script lang="ts">
    export let node: MomentNode

    const COL_CLASS = {
        1: 'grid-cols-1',
        2: 'grid-cols-2',
        3: 'grid-cols-3',
        4: 'grid-cols-4',
    } as const

    $: slides = node.children ?? []

    $: count = slides.length

    $: isWideSlideNeeded = count >= 3 && count % 2 === 1

    $: desktopCols = Math.min(node.columns ?? count, 4)

    $: gridClass = [
        COL_CLASS[Math.min(count, 2) as keyof typeof COL_CLASS] ?? COL_CLASS[2],
        `md:${COL_CLASS[desktopCols as keyof typeof COL_CLASS] ?? COL_CLASS[4]}`,
    ].join(' ')
</script>

{#if isWideSlideNeeded}
    <div class="w-full space-y-2" style={node.css ?? ''}>
        <!-- wide slide -->
        <button type="button"
                class="w-full aspect-video overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60"
                on:click={() => {}}>
            <img src={slides[0].src ?? ''}
                 alt={slides[0].alt ?? ''}
                 class="h-full w-full object-cover"
                 loading="lazy"/>
        </button>

        <!-- remaining slides -->
        <div class="grid grid-cols-2 gap-2">
            {#each slides.slice(1) as slide (slide.id)}
                <button type="button"
                        class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60"
                        on:click={() => {}}>
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
                    class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60"
                    on:click={() => {}}>
                <img src={slide.src ?? ''}
                     alt={slide.alt ?? ''}
                     class="h-full w-full object-cover"
                     loading="lazy"/>
            </button>
        {/each}
    </div>
{/if}