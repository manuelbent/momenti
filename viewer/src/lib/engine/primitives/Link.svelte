<script lang="ts">
    import Icon from '@iconify/svelte'
    import { responsiveStyle } from '$shared/responsiveStyle'

    export let node: MomentNode

    const SOCIAL_ICONS: Record<string, string> = {
        instagram: 'mdi:instagram',
        tiktok:    'ic:baseline-tiktok',
        facebook:  'mdi:facebook',
        twitter:   'mdi:twitter',
        linkedin:  'mdi:linkedin',
        youtube:   'mdi:youtube',
        pinterest: 'mdi:pinterest',
        snapchat:  'mdi:snapchat',
        github:    'mdi:github',
        website:   'mdi:web',
    }

    $: icon = node.platform ? SOCIAL_ICONS[node.platform] : null
</script>

<a
    href={node.href || '#'}
    target="_blank"
    rel="noopener noreferrer"
    use:responsiveStyle={{ css: node.css, mobileCss: node.mobileCss }}
>
    {#if icon}
        <Icon {icon} width="1.4em" height="1.4em" />
    {:else}
        {node.html ?? ''}
    {/if}
</a>
