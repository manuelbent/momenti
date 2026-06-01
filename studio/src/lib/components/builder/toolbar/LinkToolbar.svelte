<script lang="ts">
    import { Link } from 'lucide-svelte'
    import { selectedNode, selectedFullNode, updateNode } from '$lib/stores/momentContent'

    let open = false
    $: if ($selectedNode?.type !== 'link') open = false

    const handleHrefInput = (e: Event) => {
        if (!$selectedNode?.id) return
        updateNode($selectedNode.id, { href: (e.target as HTMLInputElement).value })
    }

    const handleLabelInput = (e: Event) => {
        if (!$selectedNode?.id) return
        updateNode($selectedNode.id, { html: (e.target as HTMLInputElement).value })
    }
</script>

<div class="relative flex flex-col items-center">
    <button class="py-1 px-2.5 border rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
                   transition-colors flex items-center justify-center hover:border-black/20
                   {open ? 'border-black/20' : 'border-[#e4e0dc]'}"
            onclick={() => open = !open}
            title="Edit link URL">
        <Link class="w-3"/>
    </button>

    {#if open}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="absolute left-full ml-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5
                    bg-[#f0ede8] border border-[#0D0D0D14] rounded-lg px-2 py-2 shadow-md z-10"
             onmousedown={e => e.stopPropagation()}>
            <input type="url"
                   value={$selectedFullNode?.href ?? ''}
                   placeholder="https://"
                   onmousedown={e => e.stopPropagation()}
                   oninput={handleHrefInput}
                   class="bg-white border border-black/10 rounded-md outline-none text-[#0d0d0d]
                       text-[11px] font-[inherit] px-2 py-1 w-48"/>
            {#if !$selectedFullNode?.platform}
                <input type="text"
                       value={$selectedFullNode?.html ?? ''}
                       placeholder="Label (optional)"
                       onmousedown={e => e.stopPropagation()}
                       oninput={handleLabelInput}
                       class="bg-white border border-black/10 rounded-md outline-none text-[#0d0d0d]
                           text-[11px] font-[inherit] px-2 py-1 w-48"/>
            {/if}
        </div>
    {/if}
</div>

<div class="h-px bg-black/8 -mx-1.5 my-2"></div>

