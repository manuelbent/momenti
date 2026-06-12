<script lang="ts">
    import { moment } from '$lib/stores/moment'
    import { loadFonts } from '$shared/loadFonts'
    import Renderer from '$lib/engine/StudioRenderer.svelte'
    import StatusBar from './components/StatusBar.svelte'

    $: loadFonts($moment?.content.fonts)
</script>

<div class="justify-center overflow-auto">
    <div class="relative w-72 shrink-0 rounded-[44px] overflow-hidden border border-canvas-border flex flex-col">

        <StatusBar/>

        <!-- scrollable content — rendered at real iPhone width (390 px) then zoomed to fit the frame -->
        <div class="overflow-y-auto h-126 bg-white overflow-x-hidden">
            <div style="width: 390px; zoom: {288 / 390};">
                {#if $moment}
                    <Renderer node={$moment.content.root}/>
                {:else}
                    <div class="flex items-center justify-center h-64 text-ink/20 text-sm tracking-wide">
                        no moment yet
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>
