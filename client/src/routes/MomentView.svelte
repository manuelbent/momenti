<script lang="ts">
    import { fade } from 'svelte/transition'
    import Renderer from '$lib/engine/Renderer.svelte'

    export let moment: Moment|null
</script>

{#if moment}
    <Renderer node={moment.content.root} viewOnly={true}/>
{:else}
    <div class="flex items-center justify-center h-screen">
        <p class="text-2xl text-gray-500">Moment not found.</p>
    </div>
{/if}
