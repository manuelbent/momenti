<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Bold, Italic, Trash2, Underline, Upload } from 'lucide-svelte'
    import {
        selectedNodeId, selectedNodeType, selectedNodeDeleteId,
        moment, updateNode, deleteNode, clearSelection
    } from '$lib/stores/moment'

    let toolbarEl: HTMLElement
    let fileInput: HTMLInputElement

    const handleFileSelected = (e: Event) => {
        if (!$selectedNodeId) return
        const target = e.target as HTMLInputElement
        if (target.files?.[0]) {
            updateNode($selectedNodeId, { src: URL.createObjectURL(target.files[0]) })
        }
    }

    // traverse the tree to find the node (used for text-specific computations)
    const findNode = (node: MomentNode, id: string): MomentNode|null => {
        if (node.id === id) return node
        for (const child of node.children ?? []) {
            const found = findNode(child, id)
            if (found) return found
        }
        return null
    }

    const parseCss = (css: string): Record<string, string> => {
        const map: Record<string, string> = {}
        for (const decl of (css ?? '').split(';')) {
            const idx = decl.indexOf(':')
            if (idx === -1) continue
            const key = decl.slice(0, idx).trim()
            const val = decl.slice(idx + 1).trim()
            if (key) map[key] = val
        }
        return map
    }

    const stringifyCss = (map: Record<string, string>): string =>
        Object.entries(map).filter(([, v]) => v !== '').map(([k, v]) => `${k}: ${v}`).join('; ')

    const setCssProp = (css: string, prop: string, value: string): string => {
        const map = parseCss(css)
        if (value === '') delete map[prop]
        else map[prop] = value
        return stringifyCss(map)
    }

    $: isTextSelected = $selectedNodeType === 'text'

    $: selectedTextNode = (isTextSelected && $selectedNodeId && $moment)
        ? findNode($moment.content.root, $selectedNodeId)
        : null

    let computedVals: CssComputedVals = {} as CssComputedVals

    $: if (isTextSelected && $selectedNodeId && selectedTextNode) {
        (() => {
            const el = document.getElementById($selectedNodeId!)
            if (!el) {
                return
            }

            const s = window.getComputedStyle(el)
            computedVals = {
                color: s.color,
                fontSizePx: parseInt(s.fontSize),
                isBold: parseInt(s.fontWeight) >= 500,
                isItalic: s.fontStyle === 'italic',
                isUnderline: s.textDecorationLine.includes('underline'),
            }
        })()
    }

    $: ({ color: currentColor, fontSizePx, isBold, isItalic, isUnderline } = computedVals)

    const handleColorInput = (e: Event) => {
        if (!$selectedNodeId || !selectedTextNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedTextNode.css ?? '', 'color', (e.target as HTMLInputElement).value)
        })
    }

    const handleFontSizeInput = (e: Event) => {
        if (!$selectedNodeId || !selectedTextNode) return
        const raw = (e.target as HTMLInputElement).value.trim()
        const px = raw ? `${parseInt(raw)}px` : ''
        updateNode($selectedNodeId, { css: setCssProp(selectedTextNode.css ?? '', 'font-size', px) })
    }

    const toggleBold = () => {
        if (!$selectedNodeId || !selectedTextNode) return
        updateNode($selectedNodeId, { css: setCssProp(selectedTextNode.css ?? '', 'font-weight', isBold ? '' : 'bold') })
    }

    const toggleItalic = () => {
        if (!$selectedNodeId || !selectedTextNode) return
        updateNode($selectedNodeId, { css: setCssProp(selectedTextNode.css ?? '', 'font-style', isItalic ? '' : 'italic') })
    }

    const toggleUnderline = () => {
        if (!$selectedNodeId || !selectedTextNode) return
        updateNode($selectedNodeId, { css: setCssProp(selectedTextNode.css ?? '', 'text-decoration', isUnderline ? '' : 'underline') })
    }

    const handleDelete = () => {
        if (!$selectedNodeDeleteId) return
        deleteNode($selectedNodeDeleteId)
        clearSelection()
    }

    const handleWindowPointerDown = (e: PointerEvent) => {
        if (!$selectedNodeId) return
        const target = e.target as HTMLElement
        if (toolbarEl?.contains(target)) return
        if (target.isContentEditable) return
        // Don't deselect if clicking on another selectable node (it will re-select itself)
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
           transition-transform duration-220 ease-in-out
           -translate-y-1/2
           {$selectedNodeId ? 'translate-x-0' : '-translate-x-[calc(100%+12px)]'}"
     role="toolbar"
     aria-label="Element controls"
>
    {#if isTextSelected}
        <!-- color -->
        <div class="flex flex-col items-center gap-1.5">
            <label class="group flex items-center gap-2 cursor-pointer" title="Font color">
                <span class="w-5 h-5 rounded-full border-2 border-black/15 shrink-0 transition-colors group-hover:border-black/40"
                      style="background: {currentColor}"
                ></span>
                <input type="color"
                       value={currentColor}
                       oninput={handleColorInput}
                       class="w-0 h-0 p-0 border-0 opacity-0 absolute pointer-events-none"
                />
            </label>
        </div>

        <div class="h-px bg-black/8 -mx-1.5 my-2"></div>

        <!-- font size -->
        <div class="flex flex-col items-center gap-1.5">
            <div class="border border-black/8 rounded-md">
                <input type="number"
                       min="1"
                       max="999"
                       value={fontSizePx}
                       placeholder="px"
                       onmousedown={e => e.stopPropagation()}
                       oninput={handleFontSizeInput}
                       class="bg-transparent border-none outline-none text-[#0d0d0d] text-[13px] font-[inherit] p-1 text-center
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
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
                <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                           transition-colors flex items-center justify-center
                        {isUnderline ? 'border-black/20' : 'border-[#e4e0dc]'}"
                        onclick={toggleUnderline} title="Underline">
                    <Underline class="w-3"/>
                </button>
            </div>
        </div>

        <div class="h-px bg-black/8 -mx-1.5 my-2"></div>
    {/if}

    {#if $selectedNodeType === 'image'}
        <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                           transition-colors flex items-center justify-center"
                onclick={() => fileInput.click()}
                title="Replace image"
        >
            <Upload class="w-3"/>
        </button>
        <input bind:this={fileInput} type="file" accept="image/*" onchange={handleFileSelected} hidden/>

        <div class="h-px bg-black/8 -mx-1.5 my-2"></div>
    {/if}

    <!-- delete — always visible -->
    <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                           transition-colors flex items-center justify-center"
            onclick={handleDelete} title="Delete element">
        <Trash2 class="w-3 text-red-800"/>
    </button>
</div>
