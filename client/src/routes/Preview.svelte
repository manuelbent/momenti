<script lang="ts">
    import { fade } from 'svelte/transition'
    import { moment } from '$lib/stores/moment'
    import Renderer from '$lib/engine/Renderer.svelte'

    try {
        const m: Moment = JSON.parse(localStorage.getItem('moment__preview')!)
        moment.set(m)
    } catch (err) {
        console.error('[Preview] Could not parse moment for preview.', err)
    }
</script>

{#if $moment}
    <div in:fade={{ duration: 400 }} style="position: relative">
        <Renderer node={$moment.content.root} viewOnly={true}/>
    </div>
{/if}
