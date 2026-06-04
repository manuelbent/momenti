<script lang="ts">
    import { updateNode } from '$lib/stores/momentContent'
    import { registerImage } from '$lib/utils/imageUpload'

    export let node: MomentNode

    let fileInput: HTMLInputElement

    function handleFileSelected(e: Event) {
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
     onclick={() => fileInput.click()}
     onkeydown={() => {}}>
    <img src={node.src ?? ''} alt={node.alt ?? ''} class="main-img" />
    <div class="overlay"></div>
    <input bind:this={fileInput} type="file" accept="image/*" onchange={handleFileSelected} hidden/>
</div>

<style>
    .momenti-img-container {
        position: relative;
        display: block;
        overflow: hidden;
    }

    .momenti-img-container:hover {
        cursor: pointer;
    }

    .momenti-img-container:hover .overlay {
        opacity: 60%;
    }

    .overlay {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background-color: rgba(0, 0, 0, 0.45);
        color: #fff;
        opacity: 0;
        transition: opacity 0.2s ease;
        pointer-events: none;
    }

    .main-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
</style>

