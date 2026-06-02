<script lang="ts">
    import { getContext } from 'svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    let isPromptable = false
    const promptableVariants = ['hero', 'section']

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

    const onMouseOver = () => {
        if (viewOnly) {
            return
        }

        if (promptableVariants.includes(node.variant!)) {
            isPromptable = true
        }
    }

    const onMouseOut = () => {
        isPromptable = false
    }
</script>

<div id={node.id}
     style="{node.css}{isHero ? ';user-select:none' : ''}"
     data-nid={isHero ? node.id : undefined}
     class:momenti-selected={isSelected}
     class:momenti-promptable={isPromptable}
     onmousedown={isHero ? handleMouseDown : undefined}
     onclick={isHero ? handleClick : undefined}
     onkeydown={() => {}}
     onmouseenter={onMouseOver}
     onmouseleave={onMouseOut}
     onfocus={() => {}}
     onblur={() => {}}
     role={isHero ? 'presentation' : undefined}
>
    <slot/>
    {#if isPromptable}
        <button onclick={() => console.log(node)}
                class="absolute bg-[#f0ede8] px-2 py-1 rounded-full bottom-6 right-6 text-[10px] text-[#0d0d0d] cursor-pointer">
            <span class="font-serif text-sm">m</span>
        </button>
    {/if}
</div>

<style>
    .momenti-promptable {
        position: relative;
    }
</style>
