<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { loadFonts } from '$shared/loadFonts'
    import { moment } from '$lib/stores/moment'
    import Renderer from '$lib/engine/PreviewRenderer.svelte'

    let ready = false

    onMount(async () => {
        try {
            const m: Moment = JSON.parse(localStorage.getItem('moment__preview')!)
            moment.set(m)
            loadFonts(m.content.fonts)
        } catch (err) {
            console.error('[Preview] Could not parse moment for preview.', err)
        }
        ready = true
    })
</script>

{#if ready && $moment}
    <div in:fade={{ duration: 400 }} style="position: relative; transform: translate(0);">
        <Renderer node={$moment.content.root}/>
    </div>
{/if}
