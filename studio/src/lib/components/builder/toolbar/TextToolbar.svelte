<script lang="ts">
    import { Bold, Italic, Underline } from 'lucide-svelte'
    import { selectedNode, selectedFullNode, updateNode } from '$lib/stores/momentContent'
    import { setCssProp } from '$lib/utils/css'

    let computedVals: CssComputedVals = {} as CssComputedVals

    $: if ($selectedNode?.type === 'text' && $selectedNode?.id) {
        const el = document.getElementById($selectedNode.id)
        if (el) {
            const s = window.getComputedStyle(el)
            computedVals = {
                color: s.color,
                fontSizePx: parseInt(s.fontSize),
                isBold: parseInt(s.fontWeight) >= 500,
                isItalic: s.fontStyle === 'italic',
                isUnderline: s.textDecorationLine.includes('underline'),
            }
        }
    }

    $: ({ color: currentColor, fontSizePx, isBold, isItalic, isUnderline } = computedVals)

    const handleColorInput = (e: Event) => {
        if (!$selectedNode?.id || !$selectedFullNode) return
        updateNode($selectedNode.id, {
            css: setCssProp($selectedFullNode.css ?? '', 'color', (e.target as HTMLInputElement).value)
        })
    }

    const handleFontSizeInput = (e: Event) => {
        if (!$selectedNode?.id || !$selectedFullNode) return
        const raw = (e.target as HTMLInputElement).value.trim()
        const px = raw ? `${parseInt(raw)}px` : ''
        updateNode($selectedNode.id, { css: setCssProp($selectedFullNode.css ?? '', 'font-size', px) })
    }

    const toggleBold = () => {
        if (!$selectedNode?.id || !$selectedFullNode) return
        updateNode($selectedNode.id, { css: setCssProp($selectedFullNode.css ?? '', 'font-weight', isBold ? '' : 'bold') })
    }

    const toggleItalic = () => {
        if (!$selectedNode?.id || !$selectedFullNode) return
        updateNode($selectedNode.id, { css: setCssProp($selectedFullNode.css ?? '', 'font-style', isItalic ? '' : 'italic') })
    }

    const toggleUnderline = () => {
        if (!$selectedNode?.id || !$selectedFullNode) return
        updateNode($selectedNode.id, { css: setCssProp($selectedFullNode.css ?? '', 'text-decoration', isUnderline ? '' : 'underline') })
    }
</script>

<!-- color -->
<div class="flex flex-col items-center gap-1.5">
    <label class="group flex items-center gap-2 cursor-pointer" title="Font color">
        <span class="w-5 h-5 rounded-full border-2 border-black/15 shrink-0 transition-colors group-hover:border-black/40"
              style="background: {currentColor}"></span>
        <input type="color"
               value={currentColor}
               oninput={handleColorInput}
               class="w-0 h-0 p-0 border-0 opacity-0 absolute pointer-events-none"/>
    </label>
</div>

<div class="h-px bg-black/8 -mx-1.5 my-2"></div>

<!-- font size -->
<div class="flex flex-col items-center gap-1.5">
    <div class="border border-black/8 rounded-md">
        <input type="number"
               min="1" max="999"
               value={fontSizePx}
               placeholder="px"
               onmousedown={e => e.stopPropagation()}
               oninput={handleFontSizeInput}
               class="bg-transparent border-none outline-none text-[#0d0d0d] text-[13px] font-[inherit] p-1 text-center
                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"/>
    </div>
</div>

<div class="h-px bg-black/8 -mx-1.5 my-2"></div>

<!-- format -->
<div class="flex flex-col items-center gap-1.5">
    <div class="flex flex-col gap-1">
        <button class="py-1 px-2.5 border rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                   transition-colors flex items-center justify-center hover:border-black/20
                   {isBold ? 'border-black/20' : 'border-[#e4e0dc]'}"
                onclick={toggleBold} title="Bold">
            <Bold class="w-3"/>
        </button>
        <button class="py-1 px-2.5 border rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                   transition-colors flex items-center justify-center hover:border-black/20
                   {isItalic ? 'border-black/20' : 'border-[#e4e0dc]'}"
                onclick={toggleItalic} title="Italic">
            <Italic class="w-3"/>
        </button>
        <button class="py-1 px-2.5 border hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                   transition-colors flex items-center justify-center
                   {isUnderline ? 'border-black/20' : 'border-[#e4e0dc]'}"
                onclick={toggleUnderline} title="Underline">
            <Underline class="w-3"/>
        </button>
    </div>
</div>

<div class="h-px bg-black/8 -mx-1.5 my-2"></div>

