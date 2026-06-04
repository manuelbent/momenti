<script lang="ts">
    import { getContext } from 'svelte'
    import { updateNode } from '$lib/stores/momentContent'
    import { registerImage } from '$lib/utils/imageUpload'
    import { sidebarMode } from '$lib/stores/sidebarMode'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    $: canEdit = !viewOnly && $sidebarMode === 'settings'

    let fileInput: HTMLInputElement

    const handleFileSelected = (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        updateNode(node.id, { src: registerImage(file) });
        (e.target as HTMLInputElement).value = ''
    }
</script>

<div class="momenti-img-container"
     id={node.id}
     data-nid={node.id}
     role="presentation"
     style={node.css ?? ''}
     class:can-edit={canEdit}
     onclick={() => canEdit && fileInput.click()}
     onkeydown={() => {}}
>
    <img src={node.src ?? ''} alt={node.alt ?? ''} class="main-img" />
    {#if !viewOnly}
        <input bind:this={fileInput} type="file" accept="image/*" onchange={handleFileSelected} hidden/>
    {/if}
</div>

<style>
    .momenti-img-container {
        position: relative;
        display: block;
        overflow: hidden;
    }

    .momenti-img-container.can-edit:hover {
        cursor: pointer;
        outline: 2px dashed #ccc;
        outline-offset: -2px;
    }

    .main-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
</style>
