<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { selectedNodeId, moment, updateNode } from '$lib/stores/moment'

    let toolbarEl: HTMLElement

    // ── tree helpers ──────────────────────────────────────────────────────────
    function findNode(node: MomentNode, id: string): MomentNode | null {
        if (node.id === id) return node
        for (const child of node.children ?? []) {
            const found = findNode(child, id)
            if (found) return found
        }
        return null
    }

    // ── CSS helpers ───────────────────────────────────────────────────────────
    function parseCss(css: string): Record<string, string> {
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

    function stringifyCss(map: Record<string, string>): string {
        return Object.entries(map)
            .filter(([, v]) => v !== '')
            .map(([k, v]) => `${k}: ${v}`)
            .join('; ')
    }

    function setCssProp(css: string, prop: string, value: string): string {
        const map = parseCss(css)
        if (value === '') {
            delete map[prop]
        } else {
            map[prop] = value
        }
        return stringifyCss(map)
    }

    // ── derived state ─────────────────────────────────────────────────────────
    $: selectedNode = ($selectedNodeId && $moment)
        ? findNode($moment.content.root, $selectedNodeId)
        : null

    $: cssMap       = parseCss(selectedNode?.css ?? '')
    $: currentColor = cssMap['color'] ?? '#000000'
    $: fontSizeRaw  = cssMap['font-size'] ?? ''
    $: fontSizePx   = parseInt(fontSizeRaw) || ''
    $: isBold       = cssMap['font-weight'] === 'bold' || parseInt(cssMap['font-weight'] ?? '0') >= 700
    $: isItalic     = cssMap['font-style'] === 'italic'
    $: isUnderline  = cssMap['text-decoration'] === 'underline' || cssMap['text-decoration']?.includes('underline')

    // ── handlers ──────────────────────────────────────────────────────────────
    function handleColorInput(e: Event) {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'color', (e.target as HTMLInputElement).value)
        })
    }

    function handleFontSizeInput(e: Event) {
        if (!$selectedNodeId || !selectedNode) return
        const raw = (e.target as HTMLInputElement).value.trim()
        const px  = raw ? `${parseInt(raw)}px` : ''
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'font-size', px)
        })
    }

    function toggleBold() {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'font-weight', isBold ? '' : 'bold')
        })
    }

    function toggleItalic() {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'font-style', isItalic ? '' : 'italic')
        })
    }

    function toggleUnderline() {
        if (!$selectedNodeId || !selectedNode) return
        updateNode($selectedNodeId, {
            css: setCssProp(selectedNode.css ?? '', 'text-decoration', isUnderline ? '' : 'underline')
        })
    }

    // ── dismiss on outside click ──────────────────────────────────────────────
    function handleWindowPointerDown(e: PointerEvent) {
        if (!$selectedNodeId) return
        const target = e.target as HTMLElement
        if (toolbarEl?.contains(target)) return
        if (target.isContentEditable) return
        selectedNodeId.set(null)
    }

    onMount(()  => window.addEventListener('pointerdown', handleWindowPointerDown))
    onDestroy(() => window.removeEventListener('pointerdown', handleWindowPointerDown))
</script>

<div
    bind:this={toolbarEl}
    class="toolbar"
    class:visible={!!selectedNode}
    role="toolbar"
    aria-label="Text formatting"
>
    <!-- tag label -->
    <span class="tag-label">{selectedNode?.tag?.toUpperCase() ?? 'TEXT'}</span>

    <div class="divider"></div>

    <!-- color -->
    <div class="section">
        <label class="color-wrap" title="Font color">
            <span class="color-preview" style="background: {currentColor}"></span>
            <input
                type="color"
                value={currentColor}
                oninput={handleColorInput}
            />
        </label>
    </div>

    <div class="divider"></div>

    <!-- font size -->
    <div class="section">
        <div class="size-wrap">
            <input
                type="number"
                min="1"
                max="999"
                value={fontSizePx}
                oninput={handleFontSizeInput}
                class="size-input"
            />
        </div>
    </div>

    <div class="divider"></div>

    <!-- format -->
    <div class="section">
        <div class="format-col">
            <button
                class="fmt-btn"
                class:active={isBold}
                onclick={toggleBold}
                title="Bold"
            ><strong>B</strong></button>
            <button
                class="fmt-btn"
                class:active={isItalic}
                onclick={toggleItalic}
                title="Italic"
            ><em>I</em></button>
            <button
                class="fmt-btn"
                class:active={isUnderline}
                onclick={toggleUnderline}
                title="Underline"
            ><span class="underline-label">U</span></button>
        </div>
    </div>
</div>

<style>
    /* ── panel ─────────────────────────────────────────────────────────────── */
    .toolbar {
        position: fixed;
        left: 0;
        top: 50%;
        transform: translateY(-50%) translateX(calc(-100% - 12px));
        transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 9999;

        display: flex;
        flex-direction: column;
        align-items: stretch;

        background: #f0ede8;
        border: 1px solid #0D0D0D14;
        color: #0d0d0d;
        border-radius: 0 12px 12px 0;
        padding: 14px 12px;
        font-family: Inter, sans-serif;
        font-size: 12px;
    }

    .toolbar.visible {
        transform: translateY(-50%) translateX(0);
    }

    /* ── tag label ─────────────────────────────────────────────────────────── */
    .tag-label {
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.1em;
        opacity: 0.35;
        text-align: center;
        padding-bottom: 10px;
    }

    /* ── divider ───────────────────────────────────────────────────────────── */
    .divider {
        height: 1px;
        background: rgba(13, 13, 13, 0.08);
        margin: 0 -12px;
    }

    /* ── section ───────────────────────────────────────────────────────────── */
    .section {
        display: flex;
        flex-direction: column;
        gap: 6px;
        padding: 10px 0;
    }

    .section-label {
        font-size: 9px;
        font-weight: 600;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        opacity: 0.35;
    }

    /* ── color ─────────────────────────────────────────────────────────────── */
    .color-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .color-preview {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid rgba(13, 13, 13, 0.15);
        flex-shrink: 0;
        transition: border-color 0.15s;
    }

    .color-wrap:hover .color-preview {
        border-color: rgba(13, 13, 13, 0.4);
    }

    .color-wrap input[type="color"] {
        width: 0;
        height: 0;
        padding: 0;
        border: none;
        opacity: 0;
        position: absolute;
        pointer-events: none;
    }

    /* ── font size ─────────────────────────────────────────────────────────── */
    .size-wrap {
        border: 1px solid rgba(13, 13, 13, 0.08);
        border-radius: 6px;
    }

    .size-input {
        background: none;
        border: none;
        outline: none;
        color: #0d0d0d;
        font-size: 13px;
        font-family: inherit;
        -moz-appearance: textfield;
        appearance: textfield;
    }

    .size-input::-webkit-outer-spin-button,
    .size-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    /* ── format buttons ────────────────────────────────────────────────────── */
    .format-col {
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .fmt-btn {
        height: 28px;
        border: 1px solid #e4e0dc;
        border-radius: 6px;
        color: #0d0d0d;
        font-size: 12px;
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s, border-color 0.15s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .fmt-btn:hover {
        border-color: rgba(13, 13, 13, 0.2);
    }

    .fmt-btn.active {
        border-color: rgba(13, 13, 13, 0.2);
    }

    .underline-label {
        text-decoration: underline;
    }
</style>

