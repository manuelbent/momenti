<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Trash2 } from 'lucide-svelte'
    import { selectedNode, selectedHeroImageNode, clearSelection, deleteNode } from '$lib/stores/momentContent'
    import TextToolbar from './toolbar/TextToolbar.svelte'
    import HeroImageToolbar from './toolbar/HeroImageToolbar.svelte'
    import ImageToolbar from './toolbar/ImageToolbar.svelte'
    import CarouselToolbar from './toolbar/CarouselToolbar.svelte'
    import LinkToolbar from './toolbar/LinkToolbar.svelte'

    let toolbarEl: HTMLElement

    const handleDelete = () => {
        if (!$selectedNode?.deleteId) return
        deleteNode($selectedNode.deleteId)
        clearSelection()
    }

    const handleWindowPointerDown = (e: PointerEvent) => {
        if (!$selectedNode) return
        const target = e.target as HTMLElement
        if (toolbarEl?.contains(target)) return
        if (target.isContentEditable) return
        if (target.closest('[data-nid]')) return
        clearSelection()
    }

    onMount(() => window.addEventListener('pointerdown', handleWindowPointerDown))
    onDestroy(() => window.removeEventListener('pointerdown', handleWindowPointerDown))
</script>

<div bind:this={toolbarEl}
     onmousedown={e => e.preventDefault()}
     tabindex="-1"
     class="fixed left-0 top-1/2 z-9999 flex flex-col items-stretch
            bg-[#f0ede8] border border-[#0D0D0D14] text-[#0d0d0d]
            rounded-r-xl py-2 px-1.5 font-[Inter,sans-serif] text-xs
            -translate-y-1/2
            {$selectedNode ? 'translate-x-0' : '-translate-x-[calc(100%+12px)]'}"
     role="toolbar"
     aria-label="Element controls"
>
    {#if $selectedNode?.type === 'text'}
        <TextToolbar/>
    {/if}

    {#if $selectedNode?.type === 'box' && $selectedHeroImageNode}
        <HeroImageToolbar/>
    {/if}

    {#if $selectedNode?.type === 'image'}
        <ImageToolbar/>
    {/if}

    {#if $selectedNode?.type === 'carousel'}
        <CarouselToolbar/>
    {/if}

    {#if $selectedNode?.type === 'link'}
        <LinkToolbar/>
    {/if}

    <!-- delete -->
    {#if $selectedNode !== null}
        <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                       transition-colors flex items-center justify-center"
                onclick={handleDelete} title="Delete element">
            <Trash2 class="w-3 text-red-800"/>
        </button>
    {/if}
</div>
