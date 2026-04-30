<script lang="ts">
    import { fade } from 'svelte/transition'
    import { push } from 'svelte-spa-router'
    import { moment } from '../lib/stores/moment'
    import Renderer from '../lib/engine/Renderer.svelte'

    // If the user lands here without generating, redirect home
    if (!$moment) {
        push('/')
    }
</script>

{#if $moment}
    <div in:fade={{ duration: 400 }} style="position: relative">
        <Renderer node={$moment.content.root}/>
    </div>
{/if}
