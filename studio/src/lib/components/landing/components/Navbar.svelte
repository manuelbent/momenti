<script lang="ts">
    import { SwatchBook } from 'lucide-svelte'
    import { inviteKey } from '$lib/stores/auth'
</script>

<header class="flex items-center px-6 md:px-10 py-7 border-b border-white/6">
    <span class="text-[18px] font-normal tracking-[0.12em]">momenti</span>
    {#if $inviteKey}
        <a href="/#/studio" class="ml-auto text-[#888] hover:text-[#f0ede8] transition-colors duration-150">
            <SwatchBook size={20} strokeWidth={1.5}/>
        </a>
    {/if}
</header>
