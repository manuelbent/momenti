<script lang="ts">
    import { selectedSection } from '$lib/stores/section'
    import { sidebarMode } from '$lib/stores/sidebarMode'

    export let node: MomentNode

    // only sections (hero and section) can be selected, and only in changes mode
    $: isSection = ['hero', 'section'].includes(node.variant!)
    $: isChangesMode = $sidebarMode === 'changes'
    $: isSelected = isSection && isChangesMode && $selectedSection?.id === node.id

    function handleClick() {
        if (!isSection || !isChangesMode) {
            return
        }

        selectedSection.set($selectedSection?.id === node.id ? null : node)
    }
</script>

<div id={node.id}
     data-nid={node.id}
     data-label={node.id}
     style={node.css}
     class:selectable={isSection && isChangesMode}
     class:selected={isSelected}
     onclick={handleClick}
     role="presentation"
>
    <slot/>
</div>

<style>
    .selectable {
        position: relative;
    }

    .selectable:hover {
        box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.45);
        cursor: pointer;
    }

    .selectable:hover::after {
        content: attr(data-label);
        position: absolute;
        top: 5px;
        left: 5px;
        padding: 2px 7px;
        background: rgba(220, 38, 38, 0.85);
        color: #fff;
        font-size: 10px;
        font-family: sans-serif;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: 3px;
        pointer-events: none;
        white-space: nowrap;
        z-index: 10;
    }

    .selected {
        box-shadow: 0 0 0 1px rgba(220, 38, 38, 0.8) !important;
    }

    .selected::after {
        content: attr(data-label);
        position: absolute;
        top: 5px;
        left: 5px;
        padding: 2px 7px;
        background: rgba(220, 38, 38, 1) !important;
        color: #fff;
        font-size: 10px;
        font-family: sans-serif;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border-radius: 3px;
        pointer-events: none;
        white-space: nowrap;
        z-index: 10;
    }
</style>
