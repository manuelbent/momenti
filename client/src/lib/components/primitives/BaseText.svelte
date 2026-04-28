<script lang="ts">
    import { updateNode } from '../../stores/moment'

    export let id: string // We need the ID to update the store
    export let tag: string = 'p'
    export let html: string = ''
    export let css: string = ''
    export let isEditable: boolean = true // For now, we'll keep it true for the builder

    function handleInput(e: Event) {
        const target = e.target as HTMLElement
        updateNode(id, { html: target.innerHTML })
    }
</script>

<svelte:element
        this={tag}
        style={css}
        contenteditable={isEditable}
        on:input={handleInput}
        on:blur={() => {/* Optional: save to backend here */}}
>
    {@html html}
</svelte:element>

<style>
    /* Add a subtle hint that it's editable when hovered */
    [contenteditable="true"]:hover {
        outline: 1px dashed #ccc;
        cursor: text;
    }

    /* Remove default focus outline if you prefer a custom look */
    [contenteditable="true"]:focus {
        outline: 2px solid #3b82f6;
    }
</style>