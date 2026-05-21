<script lang="ts">
    import { getContext } from 'svelte'
    import { selectNode, selectedNodeId } from '$lib/stores/moment'

    export let id: string = ''
    export let src: string = ''
    export let alt: string = ''
    export let css: string = ''

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    $: isSelected = !viewOnly && $selectedNodeId === id
</script>

<div class="momenti-img-container"
     class:momenti-selected={isSelected}
     id={id}
     data-nid={id}
     role="presentation"
     style={css}
     onclick={() => !viewOnly && selectNode({ id, type: 'image', deleteId: id })}
     onkeydown={() => {}}
>
    <img {src} {alt} class="main-img" />
</div>

<style>
    .momenti-img-container {
        position: relative;
        display: block;
        overflow: hidden;
        cursor: pointer;
    }

    .main-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
</style>