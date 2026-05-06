<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { selectedNodeId, moment, updateNode } from '$lib/stores/moment'

    let toolbarEl: HTMLElement

    // traverse the tree to find the node
    const findNode = (node: MomentNode, id: string): MomentNode|null => {
        if (node.id === id) {
            return node
        }

        for (const child of node.children ?? []) {
            const found = findNode(child, id)
            if (found) {
                return found
            }
        }

        return null
    }

    const parseCss = (css: string): Record<string, string> => {
        const map: Record<string, string> = {}

        for (const decl of (css ?? '').split(';')) {
            const idx = decl.indexOf(':')
            if (idx === -1) {
                continue
            }

            const key = decl.slice(0, idx).trim()
            const val = decl.slice(idx + 1).trim()
            if (key) {
                map[key] = val
            }
        }

        return map
    }

    const stringifyCss = (map: Record<string, string>): string => {
        return Object.entries(map)
            .filter(([, v]) => v !== '')
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ')
    }

    const setCssProp = (css: string, prop: string, value: string): string => {
        const map = parseCss(css)
        if (value === '') {
            delete map[prop]
        } else {
            map[prop] = value
        }
        return stringifyCss(map)
    }

    $: selectedNode = ($selectedNodeId && $moment)
        ? findNode($moment.content.root, $selectedNodeId)
        : null

    // All display values read from the live computed style of the DOM element.
    // Latched so they don't snap to defaults while the toolbar animates out.
    interface ComputedVals {
        color: string
        fontSizePx: number | ''
        isBold: boolean
        isItalic: boolean
        isUnderline: boolean
    }

    const defaultVals: ComputedVals = {
        color: '#000000',
        fontSizePx: '',
        isBold: false,
        isItalic: false,
        isUnderline: false,
    }

    let latchedVals: ComputedVals = { ...defaultVals }

    $: if ($selectedNodeId && selectedNode) {
        Promise.resolve().then(() => {
            const el = document.getElementById($selectedNodeId!)
            if (!el) {
                return
            }

            const s = window.getComputedStyle(el)
            latchedVals = {
                color: s.color || '#000000',
                fontSizePx: parseInt(s.fontSize) || '',
                isBold: parseInt(s.fontWeight) >= 700,
                isItalic: s.fontStyle === 'italic',
                isUnderline: s.textDecorationLine.includes('underline'),
            }
        })
    } else {
        latchedVals = { ...defaultVals }
    }

    $: ({ color: currentColor, fontSizePx, isBold, isItalic, isUnderline } = latchedVals)

    const handleColorInput = (e: Event) => {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'color', (e.target as HTMLInputElement).value)
        })
    }

    const handleFontSizeInput = (e: Event) => {
        if (!$selectedNodeId || !selectedNode) return
        const raw = (e.target as HTMLInputElement).value.trim()
        const px = raw ? `${parseInt(raw)}px` : ''
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'font-size', px)
        })
    }

    const toggleBold = () => {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'font-weight', isBold ? '' : 'bold')
        })
    }

    const toggleItalic = () => {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'font-style', isItalic ? '' : 'italic')
        })
    }

    const toggleUnderline = () => {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'text-decoration', isUnderline ? '' : 'underline')
        })
    }

    const handleWindowPointerDown = (e: PointerEvent) => {
        if (!$selectedNodeId) return
        const target = e.target as HTMLElement
        if (toolbarEl?.contains(target)) return
        if (target.isContentEditable) return
        selectedNodeId.set(null)
    }

    onMount(() => window.addEventListener('pointerdown', handleWindowPointerDown))
    onDestroy(() => window.removeEventListener('pointerdown', handleWindowPointerDown))
</script>

<div bind:this={toolbarEl}
     onmousedown={e => e.preventDefault()}
     tabindex="-1"
     class="fixed left-0 top-1/2 z-9999 flex flex-col items-stretch
           bg-[#f0ede8] border border-[#0D0D0D14] text-[#0d0d0d]
           rounded-r-xl p-2.5 font-[Inter,sans-serif] text-xs
           transition-transform duration-220 ease-in-out
           -translate-y-1/2
           {selectedNode ? 'translate-x-0' : '-translate-x-[calc(100%+12px)]'}"
     role="toolbar"
     aria-label="Text formatting"
>
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

    <div class="h-px bg-black/8 -mx-2.5 my-2"></div>

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

    <div class="h-px bg-black/8 -mx-2.5 my-2"></div>

    <!-- format -->
    <div class="flex flex-col items-center gap-1.5">
        <div class="flex flex-col gap-1">
            <button class="px-2.5 py-1.25 border rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                       transition-colors flex items-center justify-center hover:border-black/20
                       {isBold ? 'border-black/20' : 'border-[#e4e0dc]'}"
                    onclick={toggleBold}
                    title="Bold"
            ><strong>B</strong></button>
            <button class="px-2.5 py-1.25 border rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                       transition-colors flex items-center justify-center hover:border-black/20
                       {isItalic ? 'border-black/20' : 'border-[#e4e0dc]'}"
                    onclick={toggleItalic}
                    title="Italic"
            ><em>I</em></button>
            <button class="px-2.5 py-1.25 border rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                       transition-colors flex items-center justify-center hover:border-black/20
                       {isUnderline ? 'border-black/20' : 'border-[#e4e0dc]'}"
                    onclick={toggleUnderline}
                    title="Underline"
            ><span class="underline">U</span></button>
        </div>
    </div>
</div>
