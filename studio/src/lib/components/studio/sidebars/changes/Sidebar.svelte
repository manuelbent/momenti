<script lang="ts">
    import { selectedSection, patchState, patchChunk } from '$lib/stores/section'
    import { changes, appendChange } from '$lib/stores/changes'
    import { moment } from '$lib/stores/moment'
    import { editorState } from '$lib/stores/editorState'
    import { showToast } from '$lib/stores/toast'
    import { patch } from '$lib/api/moments'
    import Counter from '$lib/components/studio/sidebars/changes/components/Counter.svelte'
    import History from '$lib/components/studio/sidebars/changes/components/history/History.svelte'
    import PromptInput from '$lib/components/studio/sidebars/changes/components/PromptInput.svelte'

    let historyEl: HTMLDivElement | null = $state(null)
    let pendingPrompt: string | null = $state(null)

    const isStreaming = $derived($patchState === 'streaming')

    const loadChange = (change: Change) => {
        moment.update(m => ({ ...m, content: change.new_content }))
        editorState.setDirty()
    }

    const submit = async (submittedPrompt: string) => {
        if (isStreaming) {
            return
        }

        // a section is optional: when none is selected the change applies page-wide
        const submittedNodeId = $selectedSection?.id ?? null

        // Immediately show the user's message
        pendingPrompt = submittedPrompt

        patchChunk.set('')
        patchState.set('streaming')

        try {
            await patch({
                momentId: $moment.id,
                nodeId: submittedNodeId ?? undefined,
                prompt: submittedPrompt,
                content: $moment.content,
                callbacks: {
                    onChunk: (chunk: string) => {
                        patchChunk.update(v => v + chunk)
                    },
                    onError: () => {
                        patchState.set('error')
                        patchChunk.set('')
                        pendingPrompt = null
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

                        // Clear pending message after change is added
                        pendingPrompt = null
                    },
                },
            })
        } catch (err) {
            patchState.set('error')
            patchChunk.set('')
            pendingPrompt = null
            showToast((err as any).message, 'error')
        }
    }
</script>

<div class="flex flex-col h-full">
    <Counter used={$changes.length}/>

    <History bind:historyEl onload={loadChange} {isStreaming} {pendingPrompt}/>

    <PromptInput selectedSection={$selectedSection} {isStreaming} onsubmit={submit}/>
</div>
