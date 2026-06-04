<script lang="ts">
    import { onMount, getContext } from 'svelte'
    import { updateNode } from '$lib/stores/momentContent'
    import { sidebarMode } from '$lib/stores/sidebarMode'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    let element: HTMLElement
    let isEditing = false

    // Editing is only allowed in settings mode
    $: canEdit = !viewOnly && $sidebarMode === 'settings'

    // When mode switches away from settings, stop editing
    $: if (!canEdit && isEditing && element) {
        isEditing = false
        element.contentEditable = 'false'
        element.blur()
    }

    onMount(() => {
        if (element) element.innerHTML = node.html ?? ''
    })

    $: if (element && !isEditing && element.innerHTML !== (node.html ?? '')) {
        element.innerHTML = node.html ?? ''
    }

    function handleMouseDown() {
        if (!canEdit || isEditing) return
        // Enable contentEditable synchronously on mousedown so the browser
        // places the text cursor at the correct click position on mouseup.
        isEditing = true
        element.contentEditable = 'true'
    }

    function handleBlur() {
        isEditing = false
        element.contentEditable = 'false'
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLElement
        updateNode(node.id, { html: target.innerHTML })
    }
</script>

<svelte:element
        this={node.tag ?? 'div'}
        id={node.id}
        data-nid={node.id}
        bind:this={element}
        style={node.css}
        contenteditable="false"
        data-can-edit={canEdit || undefined}
        onmousedown={canEdit ? handleMouseDown : undefined}
        onkeydown={() => {}}
        onblur={handleBlur}
        oninput={handleInput}
        role="presentation"
/>

<style>
    /* Hint that text is clickable to edit — only in settings mode */
    [data-can-edit][contenteditable="false"]:hover {
        outline: 1px dashed #ccc;
        cursor: text;
    }

    /* Active editing state - applied via JS so use :global */
    :global([contenteditable="true"]:focus) {
        outline: 2px dashed #ccc;
    }
</style>
