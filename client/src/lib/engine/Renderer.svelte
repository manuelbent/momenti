<script lang="ts">
    import { map } from './components'
    import { moment } from '../stores/moment'
</script>

<div class="min-h-screen" style="background: {$moment.theme.background}; color: {$moment.theme.text}">
    {#each $moment.blocks as block}
        {#if map[block.type]}
            <svelte:component this={map[block.type]} {...block.props}/>
        {/if}
    {/each}
</div>
