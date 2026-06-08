<script lang="ts">
    import { ArrowUp } from 'lucide-svelte'

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
        <span class="w-1 h-1 rounded-full bg-[#dc2627]"></span>
        <span title="Currently selected section"
              class="px-0.75 py-0 font-bold rounded-xs bg-[#dc2627] text-white text-[8px] uppercase cursor-default">{selectedSection.id}</span>
    {/if}
</div>

<div class="shrink-0 border-t border-[#0d0d0d]/6 p-3">
    <form onsubmit={handleSubmit} class="relative flex">
        <textarea bind:this={textarea}
                  bind:value={promptValue}
                  disabled={isStreaming}
                  class="w-full rounded-xl px-3 py-2 pr-11 border border-[#0d0d0d]/8 outline-none resize-none
                   font-serif text-xs bg-white leading-tight text-[#0d0d0d] placeholder-[#0d0d0d]/35"
                  placeholder="What would you like to change?"
                  rows="6"
                  onkeydown={onKeyDown}></textarea>
        <button type="submit"
                disabled={!promptValue.trim() || isStreaming}
                class="absolute bottom-2 right-2 p-1 rounded-full bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/60
                   text-[#f0ede8] transition-colors disabled:opacity-30 cursor-pointer">
            <ArrowUp size={14}/>
        </button>
    </form>
</div>

