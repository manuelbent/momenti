<script lang="ts">
    import type { Snippet } from 'svelte'

    let { data, overrides, children }: {
        data: { text: string; headingSize?: 'sm'|'md'|'lg' };
        overrides?: StylingOverrides
        children?: Snippet
    } = $props()

    // Map alignments safely to Tailwind classes
    const alignmentMap = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    // Map heading sizes to responsive font scaling utilities
    const sizeMap = {
        lg: 'text-4xl md:text-6xl font-bold tracking-tight font-heading leading-tight',
        md: 'text-2xl md:text-4xl font-semibold tracking-tight font-heading leading-snug',
        sm: 'text-lg md:text-xl font-normal leading-relaxed opacity-90'
    }

    // Fallback to 'sm' (standard paragraph body text) if size isn't specified
    let size = $derived(data.headingSize || 'sm')
</script>

<div
        class="w-full {overrides?.alignment ? alignmentMap[overrides.alignment] : 'text-left'}"
        style={overrides?.customTextColor ? `color: ${overrides.customTextColor}` : ''}
>
    {#if size === 'lg'}
        <h1 class={sizeMap.lg}>
            {data.text}
        </h1>
    {:else if size === 'md'}
        <h2 class={sizeMap.md}>
            {data.text}
        </h2>
    {:else}
        <p class={sizeMap.sm}>
            {data.text}
        </p>
    {/if}

    {#if children}
        <div class="mt-4">
            {@render children?.()}
        </div>
    {/if}
</div>
