<script lang="ts">
    import ComponentRenderer from '$lib/engine/ComponentRenderer.svelte'

    let { canvas }: { canvas: Canvas } = $props()

    const paddingMap = {
        compact: 'py-8 px-4',
        normal: 'py-16 px-6 mx-auto',
        loose: 'py-24 px-8 mx-auto'
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

        {#if section.visuals?.floatingDecorations?.includes('animated-mesh-lines')}
            <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" aria-hidden="true">
                <defs>
                    <pattern id="mesh-{section.id}" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                        <path d="M48 0 L0 0 0 48" fill="none" stroke="currentColor" stroke-width="0.5"/>
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mesh-{section.id})"/>
            </svg>
        {/if}

        {#if section.visuals?.floatingDecorations?.includes('geometric-particles')}
            <div class="absolute inset-0 pointer-events-none overflow-hidden">
                {#each [
                    { x: '8%',  y: '15%', size: 18, delay: '0s',   shape: 'circle' },
                    { x: '82%', y: '22%', size: 12, delay: '0.6s',  shape: 'square' },
                    { x: '55%', y: '70%', size: 22, delay: '1.1s',  shape: 'circle' },
                    { x: '25%', y: '55%', size: 10, delay: '1.8s',  shape: 'square' },
                    { x: '70%', y: '40%', size: 16, delay: '0.3s',  shape: 'circle' },
                ] as p (p.x + p.y)}
                    <div
                        class="absolute opacity-20 {p.shape === 'circle' ? 'rounded-full' : 'rotate-45'}"
                        style="left:{p.x}; top:{p.y}; width:{p.size}px; height:{p.size}px;
                               background: currentColor;
                               animation: breathe var(--animate-breathe);
                               animation-delay:{p.delay};"
                    ></div>
                {/each}
            </div>
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
