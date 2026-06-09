<script lang="ts">
    import { changes, changesLoading } from '$lib/stores/changes'
    import { tick } from 'svelte'
    import UserMessage from '$lib/components/studio/sidebars/changes/components/history/components/UserMessage.svelte'
    import AssistantMessage
        from '$lib/components/studio/sidebars/changes/components/history/components/AssistantMessage.svelte'
    import Typing from '$lib/components/studio/sidebars/changes/components/history/components/Typing.svelte'

    let {
        onload,
        historyEl = $bindable(null),
        isStreaming,
        pendingPrompt,
    }: {
        onload: (change: Change) => void,
        historyEl?: HTMLDivElement|null
        isStreaming: boolean,
        pendingPrompt?: string|null,
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
        <!-- loading state -->
    {:else if !$changes.length && !pendingPrompt}
        <p class="text-[11px] text-[#0d0d0d]/30 text-center mt-4">No changes yet.</p>
    {:else}
        {#each $changes as change (change.id)}
            <!-- user prompt -->
            <UserMessage message={change.prompt}/>

            <!-- assistant response -->
            <AssistantMessage {change} {onload}/>
        {/each}

        {#if pendingPrompt}
            <!-- pending user prompt -->
            <UserMessage message={pendingPrompt}/>
        {/if}

        {#if isStreaming}
            <Typing/>
        {/if}
    {/if}
</div>
