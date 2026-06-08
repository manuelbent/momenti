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

<div class="container relative block overflow-hidden cursor-pointer"
     id={node.id}
     data-nid={node.id}
     role="presentation"
     style={node.css}
     onclick={() => fileInput.click()}
     onkeydown={() => {}}>
    <img src={node.src} alt={node.alt}/>
    <input bind:this={fileInput} type="file" accept="image/*" onchange={handleFileSelected} hidden/>
</div>

<style>
    .container:hover::after {
        content: "UPLOAD NEW IMAGE";
        position: absolute;
        top: 4px;
        left: 4px;
        background: #fff;
        color: #000;
        font: 600 8px/1 sans-serif;
        letter-spacing: .05em;
        padding: 1px 4px;
        border-radius: 2px;
        pointer-events: none;
        z-index: 9999;
    }
</style>
