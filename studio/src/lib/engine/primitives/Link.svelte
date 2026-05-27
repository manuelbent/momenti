<script lang="ts">
    import { getContext } from 'svelte'
    import Icon from '@iconify/svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    $: isSelected = !viewOnly && $selectedNode?.id === node.id

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

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<a
    id={node.id}
    data-nid={node.id}
    href={node.href || '#'}
    target="_blank"
    rel="noopener noreferrer"
    style={node.css ?? ''}
    class:momenti-selected={isSelected}
    onclick={(e) => { if (!viewOnly) { e.preventDefault(); selectNode({ id: node.id, type: 'link', deleteId: node.id }) } }}
>
    {#if icon}
        <Icon {icon} width="1.4em" height="1.4em" />
    {:else}
        {node.html ?? ''}
    {/if}
</a>

