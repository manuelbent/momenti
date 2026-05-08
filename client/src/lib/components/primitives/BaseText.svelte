<script lang="ts">
    import { onMount, getContext } from 'svelte'
    import { updateNode, selectedNodeId, selectedNodeRect } from '$lib/stores/moment'

    export let id: string
    export let tag: string = 'p'
    export let html: string = ''
    export let css: string = ''

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    $: isEditable = !viewOnly

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
        id={id}
        bind:this={element}
        style={css}
        contenteditable={isEditable}
        onfocus={handleFocus}
        oninput={handleInput}
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
