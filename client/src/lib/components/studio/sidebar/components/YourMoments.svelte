<script lang="ts">
    import { onMount } from 'svelte'
    import { inviteKey } from '$lib/stores/auth'
    import { moment, moments } from '$lib/stores/moment'
    import MomentItem from './MomentItem.svelte'

    onMount(async () => {
        const res = await fetch('http://localhost:3000/api/moments', {
            headers: { 'x-invite-key': $inviteKey }
        })
        if (res.ok) {
            moments.set(await res.json())
        }

        // if the store has no moment defined (new session)
        // use the first (most recent) one
        if (!$moment) {
            moment.set($moments[0])
        }
    })
</script>

<div class="flex flex-col gap-1">

    <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40 font-sans mb-1">Your moments</span>

    {#if !$moments.length}
        <p class="text-[12px] text-[#0d0d0d]/25 font-sans py-2">
            No moments yet.
        </p>
    {:else}
        {#each $moments as m}
            <MomentItem moment={m}/>
        {/each}
    {/if}

</div>
