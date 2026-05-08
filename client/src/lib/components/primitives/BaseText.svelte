<script lang="ts">
    import { onMount, getContext } from 'svelte'
    import { updateNode, selectedNodeRect } from '$lib/stores/moment'

    export let id: string
    export let tag: string = 'p'
    export let html: string = ''
    export let css: string = ''
    export let isSelected: boolean = false
    export let onSelect: (() => void) | undefined = undefined

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    $: isEditable = !viewOnly

    let element: HTMLElement

    onMount(() => {
        element.innerHTML = html
    })

    $: if (element && element.innerHTML !== html) {
        element.innerHTML = html
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLElement
        updateNode(id, { html: target.innerHTML })
    }

    function handleFocus() {
        onSelect?.()
        selectedNodeRect.set(element.getBoundingClientRect())
    }
</script>

<svelte:element
        this={tag}
        id={id}
        data-nid={id}
        class:momenti-selected={isSelected}
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
