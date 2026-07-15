<script lang="ts">
    import { SwatchBook } from 'lucide-svelte'
    import { inviteKey } from '$lib/stores/auth'
</script>

<header class="flex items-center px-6 md:px-10 py-5 border-b border-ink-accent">
    <span class="text-[18px] tracking-[0.12em] font-serif">momenti</span>
    {#if $inviteKey}
        <a href="/#/studio" class="ml-auto" title="Studio">
            <SwatchBook size={15} strokeWidth={1.2}/>
        </a>
    {/if}
</header>
