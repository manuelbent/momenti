<script lang="ts">
    import { selectedSection } from '$lib/stores/section'
    import { fade, scale } from 'svelte/transition'
    import { cubicOut } from 'svelte/easing'

    let textareaEl: HTMLTextAreaElement

    const onMouseDown = (e: MouseEvent) => {
        if (textareaEl?.contains(e.target as Node)) {
            return
        }
        e.preventDefault()
        selectedSection.set(null)
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            selectedSection.set(null)
        }
    }
</script>

<svelte:window onmousedown={onMouseDown} />

<div transition:fade={{ duration: 200 }}
     class="absolute inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center z-9"
     role="dialog"
     aria-modal="true"
     tabindex="-1"
     onkeydown={onKeyDown}>
    <div transition:scale={{ duration: 200, start: 0.96, easing: cubicOut }}
         class="bg-[#f0ede8] rounded-[14px] p-5 w-[min(480px,80%)] shadow-[0_8px_40px_rgba(13,13,13,0.35)] flex flex-col gap-3">
        <textarea
                bind:this={textareaEl}
                class="w-full bg-transparent border-none outline-none resize-none font-sans text-sm leading-6 text-[#0d0d0d] caret-[#0d0d0d] placeholder-black/35"
                placeholder="What would you like to change in this section?"
                rows="3"
                autofocus
        ></textarea>
    </div>
</div>
