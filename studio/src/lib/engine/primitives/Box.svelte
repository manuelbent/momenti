<script lang="ts">
    import { getContext, type Snippet } from 'svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'
    import { selectedSection } from '$lib/stores/section'
    import TriggerButton from './TriggerButton.svelte'
    import PromptPanel from './PromptPanel.svelte'

    const { node, children }: { node: MomentNode; children: Snippet } = $props()

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    const promptableVariants = ['hero', 'section']

    let isPromptable = $state(false)

    const isHero = $derived(!viewOnly && node.variant === 'hero')
    const isSelected = $derived(isHero && $selectedNode?.id === node.id)
    const isActiveSection = $derived(!viewOnly && $selectedSection?.id === node.id)
    const needsRelative = $derived(isPromptable || isActiveSection)

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

    const onMouseEnter = () => {
        if (viewOnly) {
            return
        }

        if (promptableVariants.includes(node.variant!)) {
            isPromptable = true
        }
    }

    const onMouseLeave = () => {
        isPromptable = false
    }

    const openSection = () => selectedSection.set(node)
</script>

<div id={node.id}
     style="{node.css}{isHero ? ';user-select:none' : ''}"
     data-nid={isHero ? node.id : undefined}
     class:momenti-selected={isSelected}
     class:relative={needsRelative}
     onmousedown={handleMouseDown}
     onclick={handleClick}
     onmouseenter={onMouseEnter}
     onmouseleave={onMouseLeave}
     role={isHero ? 'presentation' : undefined}
>
    {@render children()}

    {#if isPromptable && !isActiveSection}
        <TriggerButton onclick={openSection}/>
    {/if}

    {#if isActiveSection}
        <PromptPanel/>
    {/if}
</div>
