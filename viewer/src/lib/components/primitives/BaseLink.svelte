<script lang="ts">
    import Icon from '@iconify/svelte'

    export let href: string = ''
    export let html: string = ''
    export let css: string = ''
    export let platform: 'instagram' | 'tiktok' | undefined = undefined

    const SOCIAL_ICONS: Record<'instagram' | 'tiktok', string> = {
        instagram: 'mdi:instagram',
        tiktok:    'ic:baseline-tiktok',
    }

    $: icon = platform ? SOCIAL_ICONS[platform] : null
</script>

<a
    href={href || '#'}
    target="_blank"
    rel="noopener noreferrer"
    style={css}
>
    {#if icon}
        <Icon {icon} width="1.4em" height="1.4em" />
    {:else}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html html}
    {/if}
</a>
