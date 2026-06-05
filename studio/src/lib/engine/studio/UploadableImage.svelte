<script lang="ts">
    import { updateNode } from '$lib/stores/momentContent'
    import { registerImage } from '$lib/utils/imageUpload'
    import { tooltip } from '$lib/actions/tooltip'

    export let node: MomentNode

    let fileInput: HTMLInputElement

    function handleFileSelected(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        updateNode(node.id, { src: registerImage(file) });
        (e.target as HTMLInputElement).value = ''
    }
</script>

<div class="overflow-hidden cursor-pointer"
     id={node.id}
     data-nid={node.id}
     role="presentation"
     style={node.css}
     use:tooltip={"Upload new image"}
     onclick={() => fileInput.click()}
     onkeydown={() => {}}>
    <img src={node.src} alt={node.alt}/>
    <input bind:this={fileInput} type="file" accept="image/*" onchange={handleFileSelected} hidden/>
</div>
