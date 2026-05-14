<script lang="ts">
    import DesktopFrame from './frames/desktop/DesktopFrame.svelte'
    import MobileFrame from './frames/mobile/MobileFrame.svelte'

    export let view: 'desktop'|'mobile' = 'desktop'
</script>

<div class="flex flex-1 justify-center w-full min-h-0 p-8">
    {#if view === 'desktop'}
        <DesktopFrame/>
    {/if}

    {#if view === 'mobile'}
        <MobileFrame/>
    {/if}
</div>
