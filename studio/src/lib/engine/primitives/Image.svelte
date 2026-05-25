<script lang="ts">
    import { getContext } from 'svelte'
    import { selectNode, selectedNodeId } from '$lib/stores/moment'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    $: isSelected = !viewOnly && $selectedNodeId === node.id
</script>

<div class="momenti-img-container"
     class:momenti-selected={isSelected}
     id={node.id}
     data-nid={node.id}
     role="presentation"
     style={node.css ?? ''}
     onclick={() => !viewOnly && selectNode({ id: node.id, type: 'image', deleteId: node.id })}
     onkeydown={() => {}}
>
    <img src={node.src ?? ''} alt={node.alt ?? ''} class="main-img" />
</div>

<style>
    .momenti-img-container {
        position: relative;
        display: block;
        overflow: hidden;
    }

    .main-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
</style>

