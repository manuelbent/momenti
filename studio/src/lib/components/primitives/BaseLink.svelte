<script lang="ts">
    import { getContext } from 'svelte'
    import Icon from '@iconify/svelte'

    export let id: string = ''
    export let href: string = ''
    export let html: string = ''
    export let css: string = ''
    export let platform: 'instagram' | 'tiktok' | undefined = undefined
    export let isSelected: boolean = false
    export let onSelect: (() => void) | undefined = undefined

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    const SOCIAL_ICONS: Record<'instagram' | 'tiktok', string> = {
        instagram: 'mdi:instagram',
        tiktok:    'ic:baseline-tiktok',
    }

    $: icon = platform ? SOCIAL_ICONS[platform] : null
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<a
    {id}
    data-nid={id}
    href={href || '#'}
    target="_blank"
    rel="noopener noreferrer"
    style={css}
    class:momenti-selected={isSelected}
    onclick={(e) => { if (!viewOnly) { e.preventDefault(); onSelect?.() } }}
>
    {#if icon}
        <Icon {icon} width="1.4em" height="1.4em" />
    {:else}
        {html}
    {/if}
</a>
