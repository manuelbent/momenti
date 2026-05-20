<script lang="ts">
    import FeedbackModal from '$lib/components/ui/FeedbackModal.svelte'
    import { MessageSquare } from 'lucide-svelte'

    let feedbackOpen = false
</script>

<header class="flex items-center px-6 md:px-10 py-7 border-b border-[#0d0d0d]/6">
    <a href="/">
        <span class="text-[18px] font-normal tracking-[0.12em]">momenti</span>
    </a>

    <button on:click={() => feedbackOpen = true}
            class="ml-auto -mb-2 text-[#0d0d0d]/35 hover:text-[#0d0d0d]/70 transition-colors cursor-pointer">
        <MessageSquare class="h-3"/>
    </button>
</header>

<FeedbackModal bind:open={feedbackOpen}/>
