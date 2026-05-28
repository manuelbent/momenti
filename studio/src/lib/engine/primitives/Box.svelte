<script lang="ts">
    import { getContext } from 'svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    $: isHero = !viewOnly && node.variant === 'hero'
    $: isSelected = isHero && $selectedNode?.id === node.id

    const handleClick = (e: MouseEvent) => {
        if (!isHero) return
        const target = e.target as HTMLElement
        const closestNid = target.closest('[data-nid]')
        // If the click landed inside a child interactive node, let the child handle it
        if (closestNid && (closestNid as HTMLElement).id !== node.id) return
        selectNode({ id: node.id, type: 'box', deleteId: node.id })
    }
</script>

<div id={node.id}
     style={node.css}
     data-nid={isHero ? node.id : undefined}
     class:momenti-selected={isSelected}
     onclick={isHero ? handleClick : undefined}
     onkeydown={() => {}}
     role={isHero ? 'presentation' : undefined}
>
    <slot/>
</div>
