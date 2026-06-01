<script lang="ts">
    import { Minus, Plus } from 'lucide-svelte'
    import { selectedNode, selectedFullNode, updateNode } from '$lib/stores/momentContent'
    import { parseCss, setCssProp } from '$lib/utils/css'

    const STEP = 1

    $: currentMarginPx = (() => {
        const raw = parseCss($selectedFullNode?.css ?? '')['margin']
        return raw ? parseInt(raw) || 0 : 0
    })()

    const adjust = (delta: number) => {
        if (!$selectedNode?.id || !$selectedFullNode) return
        const next = Math.max(0, currentMarginPx + delta)
        const val = next === 0 ? '' : `${next}px 0`
        updateNode($selectedNode.id, { css: setCssProp($selectedFullNode.css ?? '', 'margin', val) })
    }
</script>

<div class="flex flex-col items-center gap-1">
    <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                   transition-colors flex items-center justify-center"
            onclick={() => adjust(STEP)} title="Increase margin">
        <Plus class="w-3"/>
    </button>
    <span class="text-[10px] text-black/40 leading-none">{currentMarginPx}</span>
    <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                   transition-colors flex items-center justify-center"
            onclick={() => adjust(-STEP)} title="Decrease margin">
        <Minus class="w-3"/>
    </button>
</div>

