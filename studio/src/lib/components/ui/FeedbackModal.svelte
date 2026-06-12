<script lang="ts">
    import { Send, X } from 'lucide-svelte'
    import { fade, fly } from 'svelte/transition'
    import { showToast } from '$lib/stores/toast'
    import { submitFeedback } from '$lib/api/feedbacks'

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
         class="fixed inset-0 z-9990 bg-tertiary/20 backdrop-blur-[2px]"
         transition:fade={{ duration: 180 }}
         onclick={close}>
    </div>

    <!-- modal -->
    <div role="dialog"
         aria-modal="true"
         aria-label="Send feedback"
         class="fixed z-9991 bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2
               w-full max-w-md bg-primary border border-accent rounded-2xl
               shadow-xl px-7 py-6 flex flex-col gap-5"
         transition:fly={{ y: 12, duration: 220, opacity: 0 }}>

        <div class="flex items-center justify-between">
            <span class="text-[15px] tracking-[0.06em] font-serif">Feedback</span>
            <button onclick={close}
                    class="text-secondary hover:text-secondary-hover transition-colors cursor-pointer"
                    aria-label="Close">
                <X class="h-3"/>
            </button>
        </div>

        <!-- type selector -->
        <div class="flex gap-2">
            {#each types as t}
                <button onclick={() => type = t.value}
                        class="flex-1 py-2.5 rounded-md border text-[11px] tracking-[0.08em] cursor-pointer transition-all duration-150
                        {type === t.value
                            ? 'bg-tertiary text-primary border-tertiary'
                            : 'bg-transparent text-secondary hover:text-secondary-hover border-accent hover:border-accent-hover'}"
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
                    class="w-full resize-none rounded-xl border border-accent bg-white/50
                   px-4 py-3 text-[12px] tracking-[0.04em] text-tertiary placeholder-secondary/50
                   focus:outline-none focus:border-accent-hover transition-colors duration-150"
            ></textarea>
            <span class="text-[11px] ml-auto flex justify-end -mt-1
                {message.length >= 500 ? 'text-red-400' : 'text-[#acaaa7]'}">
                {message.length}/500
            </span>
        </div>

        <!-- submit -->
        <button onclick={submit}
                disabled={message.trim().length < 10}
                class="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md
                text-[12px] tracking-[0.08em] border
                 border-accent hover:border-accent-hover disabled:border-accent
                 text-secondary hover:text-secondary-hover disabled:text-accent
                 transition-colors duration-150
                 cursor-pointer disabled:cursor-default">
            <Send size={12} strokeWidth={1.8}/>
            Send
        </button>

    </div>
{/if}
