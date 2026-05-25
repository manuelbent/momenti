<script lang="ts">
    import { onMount, getContext } from 'svelte'
    import { updateNode, selectedNodeRect, selectNode, selectedNodeId } from '$lib/stores/moment'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    $: isEditable = !viewOnly
    $: isSelected = !viewOnly && $selectedNodeId === node.id

    let element: HTMLElement

    onMount(() => {
        element.innerHTML = node.html ?? ''
    })

    $: if (element && element.innerHTML !== (node.html ?? '')) {
        element.innerHTML = node.html ?? ''
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLElement
        updateNode(node.id, { html: target.innerHTML })
    }

    function handleFocus() {
        selectNode({ id: node.id, type: 'text', deleteId: node.id })
        selectedNodeRect.set(element.getBoundingClientRect())
    }
</script>

<svelte:element
        this={node.tag ?? 'p'}
        id={node.id}
        data-nid={node.id}
        class:momenti-selected={isSelected}
        bind:this={element}
        style={node.css ?? ''}
        contenteditable={isEditable}
        onfocus={handleFocus}
        oninput={handleInput}
/>

<style>
    /* Add a subtle hint that it's editable when hovered */
    [contenteditable="true"]:hover {
        outline: 1px dashed #ccc;
    }

    /* Remove default focus outline if you prefer a custom look */
    [contenteditable="true"]:focus {
        outline: 2px dashed #ccc;
    }
</style>

