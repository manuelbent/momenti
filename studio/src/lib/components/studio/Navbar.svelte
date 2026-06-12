<script lang="ts">
    import FeedbackModal from '$lib/components/ui/FeedbackModal.svelte'
    import { MessageSquare } from 'lucide-svelte'

    let feedbackOpen = false
</script>

<header class="flex items-center px-6 md:px-10 py-7 border-b border-ink-accent">
    <a href="/">
        <span class="text-[18px] tracking-[0.12em] font-serif">momenti</span>
    </a>

    <button on:click={() => feedbackOpen = true}
            class="ml-auto text-ink cursor-pointer">
        <MessageSquare size={12} strokeWidth={1.8}/>
    </button>
</header>

<FeedbackModal bind:open={feedbackOpen}/>
