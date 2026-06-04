<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import { selectedSection } from '$lib/stores/section'
    import { sidebarMode } from '$lib/stores/sidebarMode'

    const { node, children }: { node: MomentNode; children: Snippet } = $props()

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    const isSection = $derived(!viewOnly && ['hero', 'section'].includes(node.variant!))
    const isChangesMode = $derived($sidebarMode === 'changes')
    const isSectionSelected = $derived(isSection && isChangesMode && $selectedSection?.id === node.id)

    const handleClick = (e: MouseEvent) => {
        if (!isSection || !isChangesMode) return
        const target = e.target as HTMLElement
        if (target.closest('[contenteditable="true"]')) return
        selectedSection.set($selectedSection?.id === node.id ? null : node)
    }


</script>

<div id={node.id}
     style={node.css}
     data-nid={node.id}
     class:momenti-section-selected={isSectionSelected}
     class:momenti-section-hoverable={isSection && isChangesMode}
     onclick={handleClick}
     role="presentation"
>
    {@render children()}
</div>

<style>
    .momenti-section-hoverable:hover {
        outline: 2px dashed rgba(0,0,0,0.18);
        outline-offset: -2px;
        cursor: pointer;
    }
</style>
