<script lang="ts">
    import ComponentRenderer from '$lib/engine/ComponentRenderer.svelte'

    let { canvas }: { canvas: Canvas } = $props()

    const paddingMap = {
        compact: 'py-8 px-4',
        normal: 'py-16 px-6 max-w-7xl mx-auto',
        loose: 'py-24 px-8 max-w-7xl mx-auto'
    }
</script>

{#each canvas.sections as section (section.id)}
    <section
            style={section.visuals?.bgType === 'solid' ? `background-color: ${section.visuals.bgValue}` : ''}
            class="relative w-full overflow-hidden {paddingMap[section.layout.padding] || paddingMap.normal}"
    >
        {#if section.visuals?.floatingDecorations?.includes('glowing-blur-blob')}
            <div class="absolute top-10 right-10 w-72 h-72 rounded-full filter blur-3xl opacity-20 animate-pulse bg-(--color-primary)"></div>
        {/if}

        <div class="grid w-full gap-8
			{section.layout.type === 'split-50-50' ? 'grid-cols-1 md:grid-cols-2' : ''}
			{section.layout.type === '3-column-grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}"
        >
            {#each section.children as componentNode (componentNode.id)}
                <ComponentRenderer node={componentNode}/>
            {/each}
        </div>
    </section>
{/each}
