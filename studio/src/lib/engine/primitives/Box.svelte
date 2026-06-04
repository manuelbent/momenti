<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'

    const { node, children }: { node: MomentNode; children: Snippet } = $props()

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    const isHero = $derived(!viewOnly && node.variant === 'hero')
    const isSelected = $derived(isHero && $selectedNode?.id === node.id)

    const handleMouseDown = (e: MouseEvent) => {
        if (!isHero) {
            return
        }

        const target = e.target as HTMLElement
        if (target.closest('[contenteditable]')) {
            return
        }

        e.preventDefault()
    }

    const handleClick = (e: MouseEvent) => {
        if (!isHero) {
            return
        }

        const target = e.target as HTMLElement
        if (target.closest('[contenteditable]')) {
            return
        }

        selectNode({ id: node.id, type: 'box', deleteId: node.id })
    }


</script>

<div id={node.id}
     style="{node.css}{isHero ? ';user-select:none' : ''}"
     data-nid={isHero ? node.id : undefined}
     class:momenti-selected={isSelected}
     onmousedown={handleMouseDown}
     onclick={handleClick}
     role={isHero ? 'presentation' : undefined}
>
    {@render children()}
</div>
