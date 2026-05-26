<script lang="ts">
    import type { Snippet } from 'svelte'

    let { data, overrides, children }: {
        data: { title: string; imageSrc?: string; linkUrl?: string }
        overrides?: StylingOverrides
        children?: Snippet
    } = $props()

    const alignmentMap = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }

    let alignment = $derived(overrides?.alignment ? alignmentMap[overrides.alignment] : 'text-left')
</script>

<div class="w-full overflow-hidden rounded-(--borderRadiusGlobal) {alignment}
    {overrides?.glassmorphism ? 'backdrop-blur-md bg-white/10 border border-white/20' : ''}
    {overrides?.shadowDepth === 'soft' ? 'shadow-md' : ''}
    {overrides?.shadowDepth === 'heavy-glow' ? 'shadow-[0_0_28px_var(--color-primary)]' : ''}"
    style={overrides?.customTextColor ? `color: ${overrides.customTextColor}` : ''}
>
    {#if data.linkUrl}
        <a href={data.linkUrl} class="block group">
            {#if data.imageSrc}
                <img src={data.imageSrc}
                     alt={data.title}
                     class="w-full h-auto object-cover block transition-transform duration-300 group-hover:scale-[1.02]"
                     loading="lazy"
                />
            {/if}
            {#if data.title}
                <p class="mt-2 text-sm font-semibold opacity-80">{data.title}</p>
            {/if}
        </a>
    {:else}
        {#if data.imageSrc}
            <img src={data.imageSrc}
                 alt={data.title}
                 class="w-full h-auto object-cover block"
                 loading="lazy"
            />
        {/if}
        {#if data.title}
            <p class="mt-2 text-sm font-semibold opacity-80">{data.title}</p>
        {/if}
    {/if}

    {#if children}
        <div class="mt-3">
            {@render children?.()}
        </div>
    {/if}
</div>
