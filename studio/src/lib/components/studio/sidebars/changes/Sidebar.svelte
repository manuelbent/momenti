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

    let pendingPrompt: string | null = $state(null)

    const isStreaming = $derived($patchState === 'streaming')

    const submit = async (submittedPrompt: string) => {
        if (isStreaming) {
            return
        }

        // a section is optional: when none is selected the change applies page-wide
        const nodeId = $selectedSection?.id

        // immediately show the user's message
        pendingPrompt = submittedPrompt

        patchChunk.set('')
        patchState.set('streaming')

        try {
            await patch({
                momentId: $moment.id,
                nodeId,
                prompt: submittedPrompt,
                content: $moment.content,
                onEvent: event => {
                    switch (event.type) {
                        case 'chunk':
                            patchChunk.update(value => value + event.chunk)
                            break
                        case 'done':
                            moment.update(value => ({ ...value, content: event.data.new_content }))
                            editorState.setDirty()
                            selectedSection.set(null)
                            appendChange(event.data)
                            break
                        case 'error':
                            throw event.error
                    }
                },
            })
            patchState.set('idle')
        } catch (err) {
            patchState.set('error')
            showToast(
                err instanceof Error ? err.message : 'Could not process the prompt. Please try again.',
                'error',
            )
        } finally {
            patchChunk.set('')
            pendingPrompt = null
        }
    }
</script>

<div class="flex flex-col h-full">
    <Counter used={$changes.length}/>

    <History {isStreaming} {pendingPrompt}/>

    <PromptInput selectedSection={$selectedSection} {isStreaming} onsubmit={submit}/>
</div>
