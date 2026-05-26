<script lang="ts">
    let { data, overrides }: {
        data: { title?: string; links: Array<{ label: string; url: string }> }
        overrides?: StylingOverrides
    } = $props()

    const alignmentMap = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    }

    let alignment = $derived(overrides?.alignment ? alignmentMap[overrides.alignment] : 'text-left items-start')
</script>

<div class="w-full flex flex-col gap-3 {alignment}"
     style={overrides?.customTextColor ? `color: ${overrides.customTextColor}` : ''}
>
    {#if data.title}
        <p class="text-xs font-semibold uppercase tracking-widest opacity-60 mb-1">{data.title}</p>
    {/if}

    {#each data.links as link, i (`${i}:${link.url}`)}
        <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2 text-base font-medium
                   border-b border-current/20 pb-1
                   opacity-80 hover:opacity-100 hover:translate-x-0.5 transition-all duration-200"
        >
            <span>{link.label}</span>
            <svg class="w-3.5 h-3.5 opacity-50" viewBox="0 0 16 16" fill="none"
                 stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 8h10M8 3l5 5-5 5"/>
            </svg>
        </a>
    {/each}
</div>


