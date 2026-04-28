<script lang="ts">
    import { push } from 'svelte-spa-router'
    import Renderer from '../lib/engine/Renderer.svelte'
    import { generatedMoment } from '../lib/stores/moment'

    // If the user lands here without generating, redirect home
    if (!$generatedMoment) {
        push('/')
    }
</script>

{#if $generatedMoment}
    <Renderer node={$generatedMoment.root} />
{:else}
    <!-- Redirecting… -->
{/if}

