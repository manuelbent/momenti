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
        <img src={data.imageSrc}
             alt={data.title}
             class="w-full h-auto object-cover block"
             loading="lazy"
        />
    {/if}
</div>
