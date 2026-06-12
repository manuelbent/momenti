<script lang="ts">
    import { CornerUpLeft } from 'lucide-svelte'

    const { change, onload } = $props()
</script>

<div class="flex flex-col items-start gap-1" title="{new Date(change.created_at).toLocaleString()}">
    <div class="max-w-[85%] bg-ink/4 border border-ink/8 rounded-xl rounded-tl-xs px-3 py-2 flex items-center gap-2">
                    <span class="font-serif text-xs text-ink/70 leading-snug flex-1">
                        {#if change.node_id}
                            Changes applied to <span class="font-bold">{change.node_id}</span>.
                        {:else}
                            Changes applied to your moment.
                        {/if}
                    </span>
        <button onclick={() => onload(change)}
                class="shrink-0 p-1 rounded-md text-ink/40 bg-canvas border border-ink/6 hover:border-black/12 transition-all duration-150 cursor-pointer"
                title="Load this version into the editor">
            <CornerUpLeft size={10}/>
        </button>
    </div>
</div>