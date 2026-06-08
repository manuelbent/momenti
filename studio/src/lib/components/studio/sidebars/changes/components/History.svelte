<script lang="ts">
    import { CornerUpLeft } from 'lucide-svelte'
    import { changes, changesLoading } from '$lib/stores/changes'
    import { tick } from 'svelte'

    let {
        onload,
        historyEl = $bindable(null),
        isStreaming,
        pendingPrompt,
    }: {
        onload: (change: Change) => void,
        historyEl?: HTMLDivElement|null
        isStreaming: boolean,
        pendingPrompt?: string | null,
    } = $props()

    const scrollToBottom = async () => {
        await tick()
        if (historyEl) {
            historyEl.scrollTop = historyEl.scrollHeight
        }
    }

    // watch for changes and scroll
    $effect(() => {
        $changes
        pendingPrompt
        isStreaming
        scrollToBottom()
    })
</script>

<div bind:this={historyEl} class="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-4">
    {#if $changesLoading}
        <p class="text-[11px] text-[#0d0d0d]/30 text-center mt-4">Loading…</p>
    {:else if !$changes.length && !pendingPrompt}
        <p class="text-[11px] text-[#0d0d0d]/30 text-center mt-4">No changes yet.</p>
    {:else}
        {#each $changes as change (change.id)}
            <!-- user prompt -->
            <div class="flex flex-col items-end gap-1">
                <div class="max-w-[85%] bg-[#0d0d0d]/4 border border-[#0d0d0d]/8 rounded-xl rounded-tr-xs px-3 py-2 flex items-center gap-2">
                    <p class="font-serif text-xs text-[#0d0d0d] leading-snug whitespace-pre-wrap">{change.prompt}</p>
                </div>
            </div>

            <!-- assistant response -->
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
        {/each}

        {#if pendingPrompt}
            <!-- pending user prompt -->
            <div class="flex flex-col items-end gap-1">
                <div class="max-w-[85%] bg-[#0d0d0d]/4 border border-[#0d0d0d]/8 rounded-xl rounded-tr-xs px-3 py-2 flex items-center gap-2">
                    <p class="font-serif text-xs text-[#0d0d0d] leading-snug whitespace-pre-wrap">{pendingPrompt}</p>
                </div>
            </div>
        {/if}

        {#if isStreaming}
            <div class="flex flex-col items-start gap-1">
                <div class="max-w-[85%] bg-[#0d0d0d]/4 border border-[#0d0d0d]/8 rounded-xl rounded-tl-xs px-3 py-2 flex items-center gap-2">
                    <div class="flex items-center justify-center gap-1">
                        <div class="w-1 h-1 bg-[#0d0d0d]/30 rounded-full animate-bounce"
                             style="animation-delay: 0ms;"></div>
                        <div class="w-1 h-1 bg-[#0d0d0d]/30 rounded-full animate-bounce"
                             style="animation-delay: 150ms;"></div>
                        <div class="w-1 h-1 bg-[#0d0d0d]/30 rounded-full animate-bounce"
                             style="animation-delay: 300ms;"></div>
                    </div>
                </div>
            </div>
        {/if}
    {/if}
</div>
