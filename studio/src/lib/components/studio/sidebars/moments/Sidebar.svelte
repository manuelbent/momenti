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

        // if the store has no moment defined (e.g. after a page refresh),
        // restore the previously previewed moment from local storage,
        // falling back to the first (most recent) one
        if (!$moment) {
            let current: Moment | null = null
            try {
                const stored = localStorage.getItem('momenti__preview')
                if (stored) {
                    current = JSON.parse(stored) as Moment
                }
            } catch (err) {
                console.error('[Sidebar] Could not parse previewed moment.', err)
            }

            moment.set(current ?? $moments[0])
        }

        isLoading.set(false)
    })
</script>

<div class="flex flex-col h-full overflow-y-auto p-6 gap-6">
    <Counter used={$moments.length}/>

    <div class="flex flex-col gap-3">
        {#if !$moments.length}
            <p class="text-[12px] text-ink/25 py-2">
                No moments yet.
            </p>
        {:else}
            {#each $moments as m}
                <MomentItem moment={m}/>
            {/each}
        {/if}
    </div>
</div>
