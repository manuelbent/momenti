<script lang="ts">
    import { fade } from 'svelte/transition'
    import { push } from 'svelte-spa-router'
    import Renderer from '../lib/engine/Renderer.svelte'
    import { moment } from '../lib/stores/moment'

    // If the user lands here without generating, redirect home
    if (!$moment) {
        push('/')
    }
</script>

{#if $moment}
    <div in:fade={{ duration: 400 }}>
        <Renderer node={$moment.root} />
    </div>
{/if}

