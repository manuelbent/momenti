<script>
  import { moment } from '../stores/moment.js';
  import { componentMap } from './mappings.ts';
</script>

<div class="min-h-screen" style="background: {$moment.theme.background}; color: {$moment.theme.text}">
  {#each $moment.blocks as block}
    {#if componentMap[block.type]}
      <svelte:component this={componentMap[block.type]} {...block.props} />
    {/if}
  {/each}
</div>

