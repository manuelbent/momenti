<script lang="ts">
    let { data, overrides }: {
        data: { title: string; imageSrc?: string; linkUrl?: string }
        overrides?: StylingOverrides
    } = $props()

    const alignmentMap = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }
</script>

<div class="w-full overflow-hidden rounded-(--borderRadiusGlobal)
    {overrides?.glassmorphism ? 'backdrop-blur-md bg-white/10 border border-white/20' : ''}
    {overrides?.shadowDepth === 'soft' ? 'shadow-md' : ''}
    {overrides?.shadowDepth === 'heavy-glow' ? 'shadow-[0_0_28px_var(--color-primary)]' : ''}"
>
    {#if data.imageSrc}
        {#if data.linkUrl}
            <a href={data.linkUrl} target="_blank" rel="noopener noreferrer" class="block">
                <img
                    src={data.imageSrc}
                    alt={data.title}
                    class="w-full h-auto object-cover block transition-transform duration-500 hover:scale-[1.02]"
                    loading="lazy"
                />
            </a>
        {:else}
            <img
                src={data.imageSrc}
                alt={data.title}
                class="w-full h-auto object-cover block"
                loading="lazy"
            />
        {/if}
    {/if}

    {#if data.title}
        <div class="pt-3 {overrides?.alignment ? alignmentMap[overrides.alignment] : 'text-left'}"
             style={overrides?.customTextColor ? `color: ${overrides.customTextColor}` : ''}
        >
            {#if data.linkUrl}
                <a href={data.linkUrl} target="_blank" rel="noopener noreferrer"
                   class="text-sm font-medium opacity-80 hover:opacity-100 transition-opacity underline underline-offset-2">
                    {data.title}
                </a>
            {:else}
                <p class="text-sm font-medium opacity-75">{data.title}</p>
            {/if}
        </div>
    {/if}
</div>

