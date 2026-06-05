<script lang="ts">
    import { changes, changesLoading } from '$lib/stores/changes'

    let { historyEl = $bindable(null) }: { historyEl?: HTMLDivElement | null } = $props()

    const formatTime = (iso: string): string => {
        const d = new Date(iso)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
</script>

<div bind:this={historyEl} class="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
    {#if $changesLoading}
        <p class="text-[11px] text-[#0d0d0d]/30 text-center mt-4">Loading…</p>
    {:else if !$changes.length}
        <p class="text-[11px] text-[#0d0d0d]/30 text-center mt-4">No changes yet.</p>
    {:else}
        {#each $changes as change (change.id)}
            <!-- user prompt -->
            <div class="flex flex-col items-end gap-1">
                {#if change.node_id}
                    <span class="px-1.5 py-0 font-bold rounded-xs bg-[#dc2627] text-white text-[8px] uppercase">
                        {change.node_id}
                    </span>
                {/if}
                <div class="max-w-[85%] bg-[#0d0d0d]/6 rounded-xl rounded-tr-sm px-3 py-2">
                    <p class="font-serif text-xs text-[#0d0d0d] leading-snug whitespace-pre-wrap">{change.prompt}</p>
                </div>
            </div>

            <!-- assistant response -->
            <div class="flex flex-col items-start gap-1">
                <div class="max-w-[85%] bg-[#dc2627]/8 border border-[#dc2627]/15 rounded-xl rounded-tl-sm px-3 py-2 flex items-center gap-2">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#dc2627] shrink-0"></span>
                    <p class="font-serif text-xs text-[#0d0d0d]/70 leading-snug">
                        {change.node_id ? `Section updated` : 'Moment updated'}
                    </p>
                </div>
                <span class="text-[10px] text-[#0d0d0d]/30 px-1">{formatTime(change.created_at)}</span>
            </div>
        {/each}
    {/if}
</div>

