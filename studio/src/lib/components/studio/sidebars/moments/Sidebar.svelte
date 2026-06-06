<script lang="ts">
    import { onMount } from 'svelte'
    import { moment, moments, isLoading } from '$lib/stores/moment'
    import { getMoments } from '$lib/api'
    import Counter from '$lib/components/studio/sidebars/moments/components/Counter.svelte'
    import MomentItem from '$lib/components/studio/sidebars/moments/components/MomentItem.svelte'

    onMount(async () => {
        isLoading.set(true)

        const list = await getMoments()
        moments.set(list)

        // if the store has no moment defined (new session)
        // use the first (most recent) one
        if (!$moment) {
            moment.set($moments[0])
        }

        isLoading.set(false)
    })
</script>

<div class="flex flex-col h-full overflow-y-auto p-6 gap-6">
    <Counter used={$moments.length}/>

    <div class="flex flex-col gap-3">
        {#if !$moments.length}
            <p class="text-[12px] text-[#0d0d0d]/25 py-2">
                No moments yet.
            </p>
        {:else}
            {#each $moments as m}
                <MomentItem moment={m}/>
            {/each}
        {/if}
    </div>
</div>
