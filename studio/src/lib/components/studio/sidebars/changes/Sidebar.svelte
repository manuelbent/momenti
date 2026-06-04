<script lang="ts">
    import { selectedSection, patchState, patchChunk } from '$lib/stores/section'
    import { moment } from '$lib/stores/moment'
    import { editorState } from '$lib/stores/editorState'
    import { showToast } from '$lib/stores/toast'
    import { patch } from '$lib/api/moments'
    import StreamingOverlay from '$lib/engine/patch/StreamingOverlay.svelte'
    import { ArrowUp } from 'lucide-svelte'

    let textarea: HTMLTextAreaElement|null = $state(null)
    let promptValue = $state('')

    const isStreaming = $derived($patchState === 'streaming')

    const submit = async () => {
        const sectionNode = $selectedSection
        if (!sectionNode || !promptValue.trim() || isStreaming) {
            return
        }

        patchChunk.set('')
        patchState.set('streaming')

        try {
            await patch({
                momentId: $moment.id,
                nodeId: sectionNode.id,
                prompt: promptValue.trim(),
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
                        promptValue = ''
                    },
                },
            })
        } catch {
            patchState.set('error')
            patchChunk.set('')
        }
    }

    const onTextareaKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
            submit()
        }
    }

    const onSubmit = (e: Event) => {
        e.preventDefault()
        submit()
    }
</script>

<div class="flex flex-col h-full">
    <!-- history -->
    <div class="flex-1 min-h-0 overflow-y-auto p-6">
    </div>

    <div class="flex items-center px-3 py-1 gap-1">
        {#if $selectedSection}
            <span class="w-1 h-1 rounded-full bg-[#dc2627]"></span>
            <span title="Currently selected section"
                  class="px-0.75 py-0 font-bold rounded-xs bg-[#dc2627] text-white text-[8px] uppercase cursor-default">{$selectedSection.id}</span>
        {/if}
    </div>

    <!-- prompt -->
    <div class="shrink-0 border-t border-[#0d0d0d]/6 p-3">
        <form onsubmit={onSubmit} class="relative flex">
            <textarea bind:this={textarea}
                      bind:value={promptValue}
                      class="w-full rounded-xl px-3 py-2 pr-11 border border-[#0d0d0d]/8 outline-none resize-none
                       font-serif text-xs bg-white leading-6 text-[#0d0d0d] placeholder-[#0d0d0d]/35"
                      placeholder="What would you like to change?"
                      rows="4"
                      onkeydown={onTextareaKeyDown}></textarea>
            <button type="submit"
                    disabled={!promptValue.trim() || isStreaming}
                    class="absolute bottom-2 right-2 p-1 rounded-full bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/60
                       text-[#f0ede8] transition-colors disabled:opacity-30 cursor-pointer">
                <ArrowUp size={14}/>
            </button>
        </form>
    </div>

    {#if isStreaming}
        <StreamingOverlay streamText={$patchChunk}/>
    {/if}
</div>
