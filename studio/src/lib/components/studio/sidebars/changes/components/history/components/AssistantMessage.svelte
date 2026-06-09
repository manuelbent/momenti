<script lang="ts">
    import { CornerUpLeft } from 'lucide-svelte'

    const { change, onload } = $props()
</script>

<div class="flex flex-col items-start gap-1" title="{new Date(change.created_at).toLocaleString()}">
    <div class="max-w-[85%] bg-[#0d0d0d]/4 border border-[#0d0d0d]/8 rounded-xl rounded-tl-xs px-3 py-2 flex items-center gap-2">
                    <span class="font-serif text-xs text-[#0d0d0d]/70 leading-snug flex-1">
                        {#if change.node_id}
                            Changes applied to <span class="font-bold">{change.node_id}</span>.
                        {:else}
                            Changes applied to your moment.
                        {/if}
                    </span>
        <button onclick={() => onload(change)}
                class="shrink-0 p-1 rounded-md text-[#0d0d0d]/40 bg-[#f1ede9] border border-[#0d0d0d]/6 hover:border-black/12 transition-all duration-150 cursor-pointer"
                title="Load this version into the editor">
            <CornerUpLeft size={10}/>
        </button>
    </div>
</div>