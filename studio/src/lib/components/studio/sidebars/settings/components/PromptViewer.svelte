<script lang="ts">
    import { slide } from 'svelte/transition'
    import { moment } from '$lib/stores/moment'
    import { ChevronDown } from 'lucide-svelte'

    let open = true

    $: prompt = $moment?.prompt
        .replace(/^"|"$/g, '')   // strip surrounding quotes if any
        .replace(/\\n/g, '\n')   // replace literal \n with real newlines
</script>

<div class="flex flex-col">
    <div class="flex items-center justify-between w-full">
        <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40">Message</span>
        <button on:click={() => (open = !open)}>
            <ChevronDown class="text-[#0d0d0d]/40 h-3 cursor-pointer {open ? 'rotate-180' : ''}"/>
        </button>
    </div>
    {#if open}
        <div transition:slide={{ duration: 180 }}>
            <p class="text-[11px] text-[#0d0d0d]/40 pt-1.5 font-serif">{prompt}</p>
        </div>
    {/if}
</div>
