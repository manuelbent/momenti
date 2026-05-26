<script lang="ts">
    import FrameSelector from '$lib/components/studio/FrameSelector.svelte'
    import DesktopFrame from '$lib/components/studio/frames/desktop/DesktopFrame.svelte'
    import CodeFrame from '$lib/components/studio/frames/code/CodeFrame.svelte'

    export let view: 'desktop'|'code' = 'desktop'
</script>

<div class="flex-1 min-h-0 bg-[#f0ede8] flex flex-col overflow-hidden">
    <div class="mt-8 flex justify-center shrink-0">
        <FrameSelector bind:view/>
    </div>

    <div class="flex flex-1 justify-center w-full min-h-0 p-8">
        {#if view === 'desktop'}
            <DesktopFrame/>
        {/if}

        {#if view === 'code'}
            <CodeFrame/>
        {/if}
    </div>
</div>
