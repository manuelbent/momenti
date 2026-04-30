<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { selectedNodeId, selectedNodeRect, moment, updateNode } from '../../stores/moment'
    import type { MomentNode } from '../../stores/moment'

    let toolbarEl: HTMLElement

    // Find a node by id anywhere in the tree
    function findNode(node: MomentNode, id: string): MomentNode|null {
        if (node.id === id) return node
        for (const child of node.children ?? []) {
            const found = findNode(child, id)
            if (found) return found
        }
        return null
    }

    // Extract the `color` value from a CSS string, ignoring background-color
    function extractColor(css: string): string {
        const match = css.match(/(?<![a-z-])color:\s*([^;]+)/i)
        return match ? match[1].trim() : '#000000'
    }

    // Replace (or append) `color` in a CSS string
    function replaceColor(css: string, newColor: string): string {
        return /(?<![a-z-])color:/i.test(css)
            ? css.replace(/(?<![a-z-])color:\s*[^;]+/i, `color: ${newColor}`)
            : `${css}; color: ${newColor}`
    }

    $: selectedNode = ($selectedNodeId && $moment)
        ? findNode($moment.root, $selectedNodeId)
        : null

    $: currentColor = selectedNode ? extractColor(selectedNode.css ?? '') : '#000000'

    // Toolbar position: just above the selected element
    $: rect = $selectedNodeRect
    $: toolbarTop = rect ? Math.max(8, rect.top + window.scrollY - 44) : 0
    $: toolbarLeft = rect ? rect.left + window.scrollX : 0

    function handleColorInput(e: Event) {
        if (!$selectedNodeId || !selectedNode) return
        const newColor = (e.target as HTMLInputElement).value
        updateNode($selectedNodeId, { css: replaceColor(selectedNode.css ?? '', newColor) })
    }

    // Dismiss toolbar when clicking outside text nodes and the toolbar itself
    function handleWindowPointerDown(e: PointerEvent) {
        const target = e.target as HTMLElement
        if (!$selectedNodeId) return
        if (toolbarEl?.contains(target)) return
        // If clicking a contenteditable, BaseText's focus handler will re-set selectedNodeId
        if (target.isContentEditable) return
        selectedNodeId.set(null)
    }

    onMount(() => window.addEventListener('pointerdown', handleWindowPointerDown))
    onDestroy(() => window.removeEventListener('pointerdown', handleWindowPointerDown))
</script>

{#if selectedNode}
    <div
            bind:this={toolbarEl}
            class="toolbar"
            style="top: {toolbarTop}px; left: {toolbarLeft}px"
    >
        <span class="toolbar-label">{selectedNode.tag?.toUpperCase() ?? 'TEXT'}</span>
        <div class="divider"></div>
        <label class="toolbar-item" title="Font color">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 7h6l3 9H6L9 7z"/>
                <line x1="12" y1="3" x2="12" y2="7"/>
                <rect x="3" y="18" width="18" height="3" rx="1" fill={currentColor} stroke="none"/>
            </svg>
            <input
                    type="color"
                    value={currentColor}
                    oninput={handleColorInput}
            />
        </label>
    </div>
{/if}

<style>
    .toolbar {
        position: absolute;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 4px;
        background: #1e1e1e;
        color: #f0f0f0;
        border-radius: 8px;
        padding: 5px 10px;
        font-family: Inter, sans-serif;
        font-size: 12px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        white-space: nowrap;
        /* pointer-events must stay on so color picker works */
    }

    .toolbar-label {
        font-weight: 600;
        opacity: 0.5;
        font-size: 10px;
        letter-spacing: 0.08em;
    }

    .divider {
        width: 1px;
        height: 16px;
        background: rgba(255, 255, 255, 0.15);
        margin: 0 2px;
    }

    .toolbar-item {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        padding: 2px 4px;
        border-radius: 4px;
        transition: background 0.15s;
    }

    .toolbar-item:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    /* Hide the native color swatch but keep it clickable */
    .toolbar-item input[type="color"] {
        width: 16px;
        height: 16px;
        border: none;
        border-radius: 50%;
        padding: 0;
        cursor: pointer;
        background: none;
        -webkit-appearance: none;
        appearance: none;
    }

    .toolbar-item input[type="color"]::-webkit-color-swatch-wrapper {
        padding: 0;
        border-radius: 50%;
    }

    .toolbar-item input[type="color"]::-webkit-color-swatch {
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
    }
</style>



