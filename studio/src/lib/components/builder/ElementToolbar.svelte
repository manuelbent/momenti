<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { Bold, Italic, Link, Minus, Plus, Trash2, Underline, Upload } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import {
        selectedNode,
        updateNode, deleteNode, clearSelection
    } from '$lib/stores/momentContent'
    import { pendingImages } from '$lib/stores/pendingImages'

    let toolbarEl: HTMLElement
    let fileInput: HTMLInputElement

    const handleFileSelected = (e: Event) => {
        if (!$selectedNode?.id) return
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (!file) return

        const blobUrl = URL.createObjectURL(file)
        pendingImages.add(blobUrl, file)
        updateNode($selectedNode.id, { src: blobUrl })
        target.value = ''
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

    $: isTextSelected = $selectedNode?.type === 'text'

    $: selectedLinkNode = ($selectedNode?.type === 'link' && $selectedNode?.id && $moment)
        ? findNode($moment.content.root, $selectedNode.id)
        : null

    let linkInputOpen = false
    $: if ($selectedNode?.type !== 'link') linkInputOpen = false

    const handleHrefInput = (e: Event) => {
        if (!$selectedNode?.id || !selectedLinkNode) return
        updateNode($selectedNode.id, { href: (e.target as HTMLInputElement).value })
    }

    const handleLinkHtmlInput = (e: Event) => {
        if (!$selectedNode?.id || !selectedLinkNode) return
        updateNode($selectedNode.id, { html: (e.target as HTMLInputElement).value })
    }

    $: selectedTextNode = (isTextSelected && $selectedNode?.id && $moment)
        ? findNode($moment.content.root, $selectedNode.id)
        : null

    let computedVals: CssComputedVals = {} as CssComputedVals

    $: if (isTextSelected && $selectedNode?.id && selectedTextNode) {
        (() => {
            const el = document.getElementById($selectedNode.id!)
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
        if (!$selectedNode?.id || !selectedTextNode) return
        updateNode($selectedNode.id, {
            css: setCssProp(selectedTextNode.css ?? '', 'color', (e.target as HTMLInputElement).value)
        })
    }

    const handleFontSizeInput = (e: Event) => {
        if (!$selectedNode?.id || !selectedTextNode) return
        const raw = (e.target as HTMLInputElement).value.trim()
        const px = raw ? `${parseInt(raw)}px` : ''
        updateNode($selectedNode.id, { css: setCssProp(selectedTextNode.css ?? '', 'font-size', px) })
    }

    const toggleBold = () => {
        if (!$selectedNode?.id || !selectedTextNode) return
        updateNode($selectedNode.id, { css: setCssProp(selectedTextNode.css ?? '', 'font-weight', isBold ? '' : 'bold') })
    }

    const toggleItalic = () => {
        if (!$selectedNode?.id || !selectedTextNode) return
        updateNode($selectedNode.id, { css: setCssProp(selectedTextNode.css ?? '', 'font-style', isItalic ? '' : 'italic') })
    }

    const toggleUnderline = () => {
        if (!$selectedNode?.id || !selectedTextNode) return
        updateNode($selectedNode.id, { css: setCssProp(selectedTextNode.css ?? '', 'text-decoration', isUnderline ? '' : 'underline') })
    }

    // --- margin helpers (available for every node type) ---
    const findAnyNode = (id: string): MomentNode|null =>
        $moment ? findNode($moment.content.root, id) : null

    const getMarginPx = (): number => {
        if (!$selectedNode?.id) return 0
        const node = findAnyNode($selectedNode.id)
        const raw = parseCss(node?.css ?? '')['margin']
        return raw ? parseInt(raw) || 0 : 0
    }

    $: currentMarginPx = (() => {
        if (!$selectedNode?.id || !$moment) return 0
        const node = findNode($moment.content.root, $selectedNode.id)
        const raw = parseCss(node?.css ?? '')['margin']
        return raw ? parseInt(raw) || 0 : 0
    })()

    const MARGIN_STEP = 1

    const increaseMargin = () => {
        if (!$selectedNode?.id) return
        const node = findAnyNode($selectedNode.id)
        const next = getMarginPx() + MARGIN_STEP
        updateNode($selectedNode.id, { css: setCssProp(node?.css ?? '', 'margin', `${next}px 0`) })
    }

    const decreaseMargin = () => {
        if (!$selectedNode?.id) return
        const node = findAnyNode($selectedNode.id)
        const next = Math.max(0, getMarginPx() - MARGIN_STEP)
        const val = next === 0 ? '' : `${next}px 0`
        updateNode($selectedNode.id, { css: setCssProp(node?.css ?? '', 'margin', val) })
    }

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
           {$selectedNode ? 'translate-x-0' : '-translate-x-[calc(100%+12px)]'}"
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

    {#if $selectedNode?.type === 'image'}
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

    {#if $selectedNode?.type === 'link'}
        <div class="relative flex flex-col items-center">
            <button
                    class="py-1 px-2.5 border rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                       transition-colors flex items-center justify-center hover:border-black/20
                       {linkInputOpen ? 'border-black/20' : 'border-[#e4e0dc]'}"
                    onclick={() => linkInputOpen = !linkInputOpen}
                    title="Edit link URL"
            >
                <Link class="w-3"/>
            </button>

            {#if linkInputOpen}
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <div class="absolute left-full ml-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5
                            bg-[#f0ede8] border border-[#0D0D0D14] rounded-lg px-2 py-2 shadow-md z-10"
                     onmousedown={e => e.stopPropagation()}>
                    <input type="url"
                           value={selectedLinkNode?.href ?? ''}
                           placeholder="https://"
                           onmousedown={e => e.stopPropagation()}
                           oninput={handleHrefInput}
                           class="bg-white border border-black/10 rounded-md outline-none text-[#0d0d0d]
                               text-[11px] font-[inherit] px-2 py-1 w-48"
                    />
                    {#if !selectedLinkNode?.platform}
                        <input type="text"
                               value={selectedLinkNode?.html ?? ''}
                               placeholder="Label (optional)"
                               onmousedown={e => e.stopPropagation()}
                               oninput={handleLinkHtmlInput}
                               class="bg-white border border-black/10 rounded-md outline-none text-[#0d0d0d]
                               text-[11px] font-[inherit] px-2 py-1 w-48"
                        />
                    {/if}
                </div>
            {/if}
        </div>

        <div class="h-px bg-black/8 -mx-1.5 my-2"></div>
    {/if}

    <!-- margin — always visible -->
    <div class="flex flex-col items-center gap-1">
        <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                       transition-colors flex items-center justify-center"
                onclick={increaseMargin} title="Increase margin">
            <Plus class="w-3"/>
        </button>
        <span class="text-[10px] text-black/40 leading-none">{currentMarginPx}</span>
        <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                       transition-colors flex items-center justify-center"
                onclick={decreaseMargin} title="Decrease margin">
            <Minus class="w-3"/>
        </button>
    </div>

    <div class="h-px bg-black/8 -mx-1.5 my-2"></div>

    <!-- delete — always visible -->
    <button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                           transition-colors flex items-center justify-center"
            onclick={handleDelete} title="Delete element">
        <Trash2 class="w-3 text-red-800"/>
    </button>
</div>
