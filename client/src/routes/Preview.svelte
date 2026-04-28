<script lang="ts">
    import { push } from 'svelte-spa-router'
    import Renderer from '../lib/engine/Renderer.svelte'
    import { moment } from '../lib/stores/moment'

    // If the user lands here without generating, redirect home
    if (!$moment) {
        push('/')
    }
</script>

{#if $moment}
    <Renderer node={$moment.root} />
{:else}
    <!-- Redirecting… -->
{/if}

