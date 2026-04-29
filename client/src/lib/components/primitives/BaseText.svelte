<script lang="ts">
    import { onMount } from 'svelte'
    import { updateNode, selectedNodeId, selectedNodeRect } from '../../stores/moment'

    export let id: string // We need the ID to update the store
    export let tag: string = 'p'
    export let html: string = ''
    export let css: string = ''
    export let isEditable: boolean = true // For now, we'll keep it true for the builder

    let element: HTMLElement

    onMount(() => {
        element.innerHTML = html
    })

    // Only update the DOM when html changes from outside (e.g. programmatic update).
    // When the user is typing, handleInput already keeps the store in sync with the DOM,
    // so element.innerHTML === html and this no-ops — preventing cursor jumps.
    $: if (element && element.innerHTML !== html) {
        element.innerHTML = html
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLElement
        updateNode(id, { html: target.innerHTML })
    }

    function handleFocus() {
        selectedNodeId.set(id)
        selectedNodeRect.set(element.getBoundingClientRect())
    }
</script>

<svelte:element
        this={tag}
        bind:this={element}
        style={css}
        contenteditable={isEditable}
        on:focus={handleFocus}
        on:input={handleInput}
        on:blur={() => {/* Optional: save to backend here */}}
/>

<style>
    /* Add a subtle hint that it's editable when hovered */
    [contenteditable="true"]:hover {
        outline: 1px dashed #ccc;
        cursor: text;
    }

    /* Remove default focus outline if you prefer a custom look */
    [contenteditable="true"]:focus {
        outline: 2px dashed #ccc;
    }
</style>
