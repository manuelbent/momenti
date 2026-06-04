<script lang="ts">
    import { onMount } from 'svelte'
    import { updateNode } from '$lib/stores/momentContent'

    export let node: MomentNode

    let element: HTMLElement
    let isEditing = false

    onMount(() => { element.innerHTML = node.html ?? '' })

    $: if (element && !isEditing && element.innerHTML !== (node.html ?? '')) {
        element.innerHTML = node.html ?? ''
    }

    function handleMouseDown() {
        if (isEditing) return
        // Synchronous DOM mutation on mousedown lets the browser
        // place the text cursor at the exact click position on mouseup.
        isEditing = true
        element.contentEditable = 'true'
    }

    function handleBlur() {
        isEditing = false
        element.contentEditable = 'false'
    }

    function handleInput(e: Event) {
        updateNode(node.id, { html: (e.target as HTMLElement).innerHTML })
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element
    this={node.tag ?? 'div'}
    id={node.id}
    data-nid={node.id}
    bind:this={element}
    style={node.css}
    contenteditable="false"
    onmousedown={handleMouseDown}
    onkeydown={() => {}}
    onblur={handleBlur}
    oninput={handleInput}
/>

<style>
    [contenteditable="false"]:hover {
        outline: 1px dashed #ccc;
        cursor: text;
    }

    :global([contenteditable="true"]:focus) {
        outline: 2px dashed #ccc;
    }
</style>

