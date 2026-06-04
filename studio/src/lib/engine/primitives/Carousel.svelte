<script lang="ts">
    import { getContext } from 'svelte'
    import { updateNode } from '$lib/stores/momentContent'
    import { registerImage } from '$lib/utils/imageUpload'
    import { sidebarMode } from '$lib/stores/sidebarMode'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    $: canEdit = !viewOnly && $sidebarMode === 'settings'

    let fileInputs: Record<string, HTMLInputElement> = {}

    const handleFileSelected = (e: Event, slideId: string) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        updateNode(slideId, { src: registerImage(file) });
        (e.target as HTMLInputElement).value = ''
    }

    const handleSlideClick = (e: MouseEvent, slide: MomentNode) => {
        if (!canEdit) return
        e.stopPropagation()
        fileInputs[slide.id]?.click()
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
         onkeydown={() => {}}
    >
        <!-- wide slide -->
        <button type="button"
                data-nid={slides[0].id}
                class="w-full aspect-video overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60
                       {canEdit ? 'cursor-pointer' : ''}"
                onclick={(e) => handleSlideClick(e, slides[0])}>
            <img src={slides[0].src ?? ''}
                 alt={slides[0].alt ?? ''}
                 class="h-full w-full object-cover"
                 loading="lazy"/>
        </button>
        {#if canEdit}
            <input bind:this={fileInputs[slides[0].id]} type="file" accept="image/*"
                   onchange={(e) => handleFileSelected(e, slides[0].id)} hidden/>
        {/if}

        <!-- remaining slides -->
        <div class="grid grid-cols-2 gap-2">
            {#each slides.slice(1) as slide (slide.id)}
                <button type="button"
                        data-nid={slide.id}
                        class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60
                               {canEdit ? 'cursor-pointer' : ''}"
                        onclick={(e) => handleSlideClick(e, slide)}>
                    <img src={slide.src ?? ''}
                         alt={slide.alt ?? ''}
                         class="h-full w-full object-cover"
                         loading="lazy"/>
                </button>
                {#if canEdit}
                    <input bind:this={fileInputs[slide.id]} type="file" accept="image/*"
                           onchange={(e) => handleFileSelected(e, slide.id)} hidden/>
                {/if}
            {/each}
        </div>
    </div>
{:else}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div id={node.id}
         class={`grid w-full gap-2 ${gridClass}`}
         style={node.css ?? ''}
         onkeydown={() => {}}
    >
        {#each slides as slide (slide.id)}
            <button type="button"
                    data-nid={slide.id}
                    class="aspect-square overflow-hidden rounded focus:outline-none focus:ring-2 focus:ring-white/60
                           {canEdit ? 'cursor-pointer' : ''}"
                    onclick={(e) => handleSlideClick(e, slide)}>
                <img src={slide.src ?? ''}
                     alt={slide.alt ?? ''}
                     class="h-full w-full object-cover"
                     loading="lazy"/>
            </button>
            {#if canEdit}
                <input bind:this={fileInputs[slide.id]} type="file" accept="image/*"
                       onchange={(e) => handleFileSelected(e, slide.id)} hidden/>
            {/if}
        {/each}
    </div>
{/if}