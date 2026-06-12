<script lang="ts">
    import { slide } from 'svelte/transition'
    import { moment } from '$lib/stores/moment'
    import { ChevronDown } from 'lucide-svelte'

    let open = true

    $: prompt = $moment?.prompt
        .replace(/^"|"$/g, '')   // strip surrounding quotes if any
        .replace(/\\n/g, '\n')   // replace literal \n with real newlines
</script>

<div class="flex flex-col text-ink-faint">
    <div class="flex items-center justify-between w-full">
        <span class="text-[11px] tracking-[0.12em] ">Message</span>
        <button on:click={() => (open = !open)}>
            <ChevronDown class="h-3 cursor-pointer {open ? 'rotate-180' : ''}"/>
        </button>
    </div>
    {#if open}
        <div transition:slide={{ duration: 180 }}>
            <p class="text-[11px] pt-1.5 font-serif">{prompt}</p>
        </div>
    {/if}
</div>
