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
