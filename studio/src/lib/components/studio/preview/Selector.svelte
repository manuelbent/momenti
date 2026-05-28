<script lang="ts">
    import DesktopButton from '$lib/components/studio/preview/desktop/DesktopButton.svelte'
    import CodeButton from '$lib/components/studio/preview/code/CodeButton.svelte'

    export let view: 'desktop'|'code' = 'desktop'
</script>

<div class="mt-8 flex justify-center shrink-0">
    <div class="flex items-center gap-3">
        <DesktopButton active={view === 'desktop'} onclick={() => view = 'desktop'}/>

        <span class="w-px h-3.5 bg-[#0d0d0d]/15"></span>

        <CodeButton active={view === 'code'} onclick={() => view = 'code'}/>
    </div>
</div>
