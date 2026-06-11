<script lang="ts">
    import { SwatchBook } from 'lucide-svelte'
    import { inviteKey } from '$lib/stores/auth'
</script>

<header class="flex items-center px-6 md:px-10 py-7 border-b border-accent">
    <span class="text-[18px] tracking-[0.12em] font-serif">momenti</span>
    {#if $inviteKey}
        <a href="/#/studio" class="ml-auto text-secondary hover:text-tertiary transition-colors duration-150">
            <SwatchBook size={15} strokeWidth={1.8}/>
        </a>
    {/if}
</header>
