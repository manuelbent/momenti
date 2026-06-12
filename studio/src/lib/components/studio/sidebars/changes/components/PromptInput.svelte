<script lang="ts">
    import { ArrowUp } from 'lucide-svelte'
    import { MAX_CHANGES_ALLOWED } from '$lib/config/constants'
    import { changes } from '$lib/stores/changes'

    let {
        selectedSection,
        isStreaming,
        onsubmit,
    }: {
        selectedSection: { id: string } | null
        isStreaming: boolean
        onsubmit: (prompt: string) => void
    } = $props()

    let textarea: HTMLTextAreaElement | null = $state(null)
    let promptValue = $state('')

    export function clear() {
        promptValue = ''
    }

    const isTextareaDisabled = $derived(isStreaming || $changes.length >= MAX_CHANGES_ALLOWED)
    const isButtonDisabled = $derived(!promptValue.trim() || isTextareaDisabled)

    const handleSubmit = (e: Event) => {
        e.preventDefault()
        if (!promptValue.trim() || isStreaming) return
        onsubmit(promptValue.trim())
        promptValue = ''
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
            e.preventDefault()
            handleSubmit(e)
        }
    }
</script>

<div class="flex items-center px-3 py-1 gap-1">
    {#if selectedSection}
        <span title="Currently selected section"
              class="px-0.75 py-0 font-bold rounded-xs bg-select text-white text-[8px] uppercase cursor-default">{selectedSection.id}</span>
    {/if}
</div>

<div class="shrink-0 border-t border-ink/6 p-3">
    <form onsubmit={handleSubmit} class="relative flex">
        <textarea bind:this={textarea}
                  bind:value={promptValue}
                  disabled={isTextareaDisabled}
                  class="w-full rounded-xl px-3 py-2 pr-11 border border-ink/8 outline-none resize-none
                   font-serif text-xs bg-white leading-tight text-ink placeholder-ink/35"
                  placeholder="What would you like to change?"
                  rows="6"
                  onkeydown={onKeyDown}></textarea>
        <button type="submit"
                disabled={isButtonDisabled}
                class="absolute bottom-2 right-2 p-1 rounded-full bg-ink/40 hover:bg-ink/60
                   text-canvas transition-colors cursor-pointer disabled:opacity-30 disabled:hover:bg-ink/40 disabled:cursor-default">
            <ArrowUp size={14}/>
        </button>
    </form>
</div>

