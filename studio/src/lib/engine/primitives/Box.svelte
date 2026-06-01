<script lang="ts">
    import { getContext } from 'svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    $: isHero = !viewOnly && node.variant === 'hero'
    $: isSelected = isHero && $selectedNode?.id === node.id

    const handleMouseDown = (e: MouseEvent) => {
        if (!isHero) {
            return
        }

        const target = e.target as HTMLElement

        // ff the user clicked directly on a contenteditable text node, let the
        // browser focus it normally so it stays editable
        if (target.closest('[contenteditable]')) {
            return
        }

        // prevent focus from jumping to any contenteditable child
        e.preventDefault()
    }

    const handleClick = (e: MouseEvent) => {
        if (!isHero) {
            return
        }

        const target = e.target as HTMLElement

        // if the click landed on an editable text child, let the text node
        // handle its own selection (handleFocus will call selectNode for the text)
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
     onmousedown={isHero ? handleMouseDown : undefined}
     onclick={isHero ? handleClick : undefined}
     onkeydown={() => {}}
     role={isHero ? 'presentation' : undefined}
>
    <slot/>
</div>
