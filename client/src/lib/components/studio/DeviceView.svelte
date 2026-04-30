<script lang="ts">
    import type { Moment } from '../../stores/moment'
    import DesktopFrame from './frames/desktop/DesktopFrame.svelte'
    import MobileFrame from './frames/mobile/MobileFrame.svelte'

    export let view: 'desktop'|'mobile' = 'desktop'
    export let moment: Moment|undefined = undefined
</script>

<div class="flex flex-1 justify-center w-full min-h-0 p-8">
    {#if view === 'desktop'}
        <DesktopFrame {moment}/>
    {/if}

    {#if view === 'mobile'}
        <MobileFrame {moment}/>
    {/if}
</div>
