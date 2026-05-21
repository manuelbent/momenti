<script lang="ts">
    import { Send, X } from 'lucide-svelte'
    import { fade, fly } from 'svelte/transition'
    import { showToast } from '$lib/stores/toast'
    import { submitFeedback } from '$lib/api/feedbacks'
    import Button from '$lib/components/ui/Button.svelte'

    export let open = false

    let type: FeedbackType = 'suggestion'
    let message: string = ''

    const types: { value: FeedbackType; label: string }[] = [
        { value: 'suggestion', label: 'Suggestion' },
        { value: 'bug', label: 'Bug' },
        { value: 'other', label: 'Other' },
    ]

    const close = () => {
        open = false
        type = 'suggestion'
        message = ''
    }

    const submit = async () => {
        try {
            await submitFeedback({ type, message })
            showToast('Thank you for your feedback!')
            close()
        } catch {
            showToast('Something went wrong.', 'error')
        }
    }
</script>

{#if open}
    <!-- backdrop -->
    <div role="presentation"
         class="fixed inset-0 z-9990 bg-[#0d0d0d]/20 backdrop-blur-[2px]"
         transition:fade={{ duration: 180 }}
         on:click={close}>
    </div>

    <!-- modal -->
    <div role="dialog"
         aria-modal="true"
         aria-label="Send feedback"
         class="fixed z-9991 bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2
               w-full max-w-md bg-[#f0ede8] border border-[#0d0d0d]/8 rounded-2xl
               shadow-xl px-7 py-6 flex flex-col gap-5"
         transition:fly={{ y: 12, duration: 220, opacity: 0 }}>

        <div class="flex items-center justify-between">
            <span class="text-[15px] tracking-[0.06em] font-serif">Feedback</span>
            <button on:click={close}
                    class="text-[#0d0d0d]/35 hover:text-[#0d0d0d]/70 transition-colors cursor-pointer"
                    aria-label="Close">
                <X class="h-3"/>
            </button>
        </div>

        <!-- type selector -->
        <div class="flex gap-2">
            {#each types as t}
                <button on:click={() => type = t.value}
                        class="flex-1 py-2.5 rounded-md border text-[11px] tracking-[0.08em] cursor-pointer transition-all duration-150
                        {type === t.value
                            ? 'bg-[#0d0d0d] text-[#f0ede8] border-[#0d0d0d]'
                            : 'bg-transparent text-[#0d0d0d]/50 border-[#0d0d0d]/12 hover:border-[#0d0d0d]/30 hover:text-[#0d0d0d]/70'}"
                >
                    {t.label}
                </button>
            {/each}
        </div>

        <!-- textarea -->
        <div>
            <textarea
                    bind:value={message}
                    maxlength="500"
                    placeholder="What's working? What's broken? How do we make this better?"
                    rows="5"
                    class="w-full resize-none rounded-xl border border-[#0d0d0d]/12 bg-white/50
                   px-4 py-3 text-[12px] tracking-[0.04em] text-[#0d0d0d] placeholder-[#0d0d0d]/30
                   focus:outline-none focus:border-[#0d0d0d]/30 transition-colors duration-150"
            ></textarea>
            <span class="text-[11px] ml-auto flex justify-end -mt-1
                {message.length >= 500 ? 'text-red-400' : 'text-[#acaaa7]'}">
                {message.length}/500
            </span>
        </div>

        <!-- submit -->
        <Button onclick={submit}
                disabled={message.trim().length < 10}
                class="text-[#f0ede8] bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/50">
            <Send size={12} strokeWidth={1.8}/>
            Send
        </Button>

    </div>
{/if}
