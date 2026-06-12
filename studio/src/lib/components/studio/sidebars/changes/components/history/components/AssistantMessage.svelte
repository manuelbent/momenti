<script lang="ts">
    import { CornerUpLeft } from 'lucide-svelte'

    const { change, onload } = $props()
</script>

<div class="flex flex-col items-start gap-1" title="{new Date(change.created_at).toLocaleString()}">
    <div class="max-w-[85%] bg-ink-accent/50 border border-ink-accent rounded-xl rounded-tl-xs px-3 py-2 flex items-center gap-2">
                    <span class="font-serif text-xs text-ink leading-snug flex-1">
                        {#if change.node_id}
                            Changes applied to <span class="font-bold">{change.node_id}</span>.
                        {:else}
                            Changes applied to your moment.
                        {/if}
                    </span>
        <button onclick={() => onload(change)}
                class="shrink-0 p-1 rounded-md text-ink bg-canvas border border-ink-accent hover:border-ink-accent-hover transition-all duration-150 cursor-pointer"
                title="Load this version into the editor">
            <CornerUpLeft size={10}/>
        </button>
    </div>
</div>