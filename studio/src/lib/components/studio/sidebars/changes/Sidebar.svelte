<script lang="ts">
    import { selectedSection, patchState, patchChunk } from '$lib/stores/section'
    import { changes, appendChange } from '$lib/stores/changes'
    import { moment } from '$lib/stores/moment'
    import { editorState } from '$lib/stores/editorState'
    import { showToast } from '$lib/stores/toast'
    import { patch } from '$lib/api/moments'
    import StreamingOverlay from '$lib/engine/patch/StreamingOverlay.svelte'
    import History from '$lib/components/studio/sidebars/changes/components/History.svelte'
    import PromptInput from '$lib/components/studio/sidebars/changes/components/PromptInput.svelte'
    import Counter from '$lib/components/studio/sidebars/changes/components/Counter.svelte'

    let historyEl: HTMLDivElement | null = $state(null)

    const isStreaming = $derived($patchState === 'streaming')

    const loadChange = (change: Change) => {
        moment.update(m => ({ ...m, content: change.new_content }))
        editorState.setDirty()
    }

    const submit = async (submittedPrompt: string) => {
        const sectionNode = $selectedSection
        if (!sectionNode || isStreaming) return

        const submittedNodeId = sectionNode.id

        patchChunk.set('')
        patchState.set('streaming')

        try {
            await patch({
                momentId: $moment.id,
                nodeId: sectionNode.id,
                prompt: submittedPrompt,
                content: $moment.content,
                callbacks: {
                    onChunk: (chunk: string) => {
                        patchChunk.update(v => v + chunk)
                    },
                    onError: () => {
                        patchState.set('error')
                        patchChunk.set('')
                        showToast('Could not process the prompt. Please try again.', 'error')
                    },
                    onDone: (updatedContent: MomentContent) => {
                        moment.update(m => ({ ...m, content: updatedContent }))
                        editorState.setDirty()
                        selectedSection.set(null)
                        patchState.set('idle')
                        patchChunk.set('')

                        appendChange({
                            id: Date.now(),
                            moment_id: $moment.id,
                            node_id: submittedNodeId,
                            old_content: undefined,
                            new_content: updatedContent,
                            prompt: submittedPrompt,
                            created_at: new Date().toISOString(),
                        })
                    },
                },
            })
        } catch {
            patchState.set('error')
            patchChunk.set('')
        }
    }
</script>

<div class="flex flex-col h-full">
    <Counter used={$changes.length} total={10}/>

    <History bind:historyEl onload={loadChange}/>

    <PromptInput
        selectedSection={$selectedSection}
        {isStreaming}
        onsubmit={submit}
    />

    {#if isStreaming}
        <StreamingOverlay streamText={$patchChunk}/>
    {/if}
</div>
