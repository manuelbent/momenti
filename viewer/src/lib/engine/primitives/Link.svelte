<script lang="ts">
    import Icon from '@iconify/svelte'

    export let node: MomentNode

    const SOCIAL_ICONS: Record<string, string> = {
        instagram: 'mdi:instagram',
        facebook:  'mdi:facebook',
        twitter:   'mdi:twitter',
        tiktok:    'ic:baseline-tiktok',
        pinterest: 'mdi:pinterest',
        linkedin:  'mdi:linkedin',
        youtube:   'mdi:youtube',
    }

    $: icon = node.platform ? SOCIAL_ICONS[node.platform] : null
</script>

<a
    href={node.href || '#'}
    target="_blank"
    rel="noopener noreferrer"
    style={node.css ?? ''}
>
    {#if icon}
        <Icon {icon} width="1.4em" height="1.4em" />
    {:else}
        {node.html ?? ''}
    {/if}
</a>
