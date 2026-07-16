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

<!-- Links never navigate in the studio canvas -->
<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<a id={node.id}
   data-nid={node.id}
   href={node.href || '#'}
   target="_blank"
   rel="noopener noreferrer"
   use:responsiveStyle={{ css: node.css, mobileCss: node.mobileCss }}
   onclick={e => e.preventDefault()}
>
    {#if icon}
        <Icon {icon} width="1.4em" height="1.4em"/>
    {:else}
        {node.html ?? ''}
    {/if}
</a>
