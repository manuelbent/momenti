<script lang="ts">
    import { ArrowUp } from 'lucide-svelte'
    import { MAX_CHANGES_ALLOWED } from '$lib/config/constants'
    import { changes } from '$lib/stores/changes'
    import RoundButton from '$lib/components/ui/RoundButton.svelte'

    let {
        selectedSection,
        isStreaming,
        onsubmit,
    }: {
        selectedSection: { id: string }|null
        isStreaming: boolean
        onsubmit: (prompt: string) => void
    } = $props()

    let textarea: HTMLTextAreaElement|null = $state(null)
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
    <form class="relative flex">
        <textarea bind:this={textarea}
                  bind:value={promptValue}
                  disabled={isTextareaDisabled}
                  class="w-full rounded-xl px-3 py-2 text-xs outline-none resize-none
                   border border-ink-accent text-ink
                   bg-white leading-tight placeholder-ink-accent caret-canvas font-serif"
                  placeholder="What would you like to change?"
                  rows="6"
                  onkeydown={onKeyDown}></textarea>
        <RoundButton onclick={handleSubmit} disabled={isButtonDisabled} className="absolute bottom-2 right-2">
            <ArrowUp size={12}/>
        </RoundButton>
    </form>
</div>

