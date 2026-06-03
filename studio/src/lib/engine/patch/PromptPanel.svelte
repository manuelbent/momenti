<script lang="ts">
    import { selectedSection, patchState, patchChunk } from '$lib/stores/section'
    import { fade, scale } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'
    import { moment } from '$lib/stores/moment'
    import { editorState } from '$lib/stores/editorState'
    import { showToast } from '$lib/stores/toast'
    import { patch } from '$lib/api/moments'
    import StreamingOverlay from '$lib/engine/patch/StreamingOverlay.svelte'
    import { ArrowUp } from 'lucide-svelte'

    $effect(() => {
        textarea?.focus()
    })

    let textarea: HTMLTextAreaElement|null = $state(null)
    let promptValue = $state('')
    let submitted = $state(false)

    const isStreaming = $derived($patchState === 'streaming')

    const dismiss = () => {
        if (isStreaming) {
            return
        }

        selectedSection.set(null)
        patchState.set('idle')
    }

    const onMouseDown = (e: MouseEvent) => {
        if (textarea?.contains(e.target as Node)) {
            return
        }

        e.preventDefault()
        dismiss()
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            dismiss()
        }
    }

    const submit = async () => {
        const sectionNode = $selectedSection
        if (!sectionNode || !promptValue.trim() || isStreaming) {
            return
        }

        patchChunk.set('')
        patchState.set('streaming')
        submitted = true

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
                }
            )
        } catch (err) {
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
</script>

<svelte:window onmousedown={onMouseDown}/>

{#if !submitted}
    <div transition:fade={{ duration: 200 }}
         class="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-9"
         role="dialog"
         aria-modal="true"
         aria-label="Edit section prompt"
         tabindex="-1"
         onkeydown={onKeyDown}>
        <div transition:scale={{ duration: 200, start: 0.96, easing: cubicOut }}
             class="relative bg-[#f0ede8] rounded-2xl p-5 w-[min(480px,80%)] shadow-[0_8px_40px_rgba(13,13,13,0.35)] flex flex-col gap-3"
             role="presentation"
             onmousedown={(e) => e.stopPropagation()}>
            <textarea
                    bind:this={textarea}
                    bind:value={promptValue}
                    class="w-full bg-transparent border-none outline-none resize-none font-serif text-sm leading-6 text-[#0d0d0d] caret-[#0d0d0d] placeholder-black/35 disabled:opacity-50"
                    placeholder="What would you like to change?"
                    rows="3"
                    disabled={isStreaming}
                    onkeydown={onTextareaKeyDown}
                    onclick={e => e.stopPropagation()}></textarea>

                <button onclick={submit}
                        disabled={!promptValue.trim()}
                        class="absolute bottom-2 right-2 p-2 text-[#f0ede8] text-xs font-medium rounded-full
                        bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/50 transition-colors
                         disabled:cursor-not-allowed cursor-pointer">
                    <ArrowUp size={16}/>
                </button>

        </div>
    </div>
{/if}

{#if $patchState === 'streaming'}
    <StreamingOverlay streamText={$patchChunk}/>
{/if}