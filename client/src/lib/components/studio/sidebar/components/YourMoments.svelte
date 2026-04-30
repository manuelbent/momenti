<script lang="ts">
    import MomentItem from './MomentItem.svelte'

    export let moments: Moment[] = []
</script>

<div class="flex flex-col gap-1">

    <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40 font-sans mb-1">Your moments</span>

    {#if moments.length === 0}
        <p class="text-[12px] text-[#0d0d0d]/25 font-sans py-2">
            No moments yet.
        </p>
    {:else}
        {#each moments as m}
            <MomentItem moment={m} />
        {/each}
    {/if}

</div>
