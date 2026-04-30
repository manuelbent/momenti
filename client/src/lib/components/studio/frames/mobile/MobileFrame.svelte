<script lang="ts">
    import Renderer from '../../../../engine/Renderer.svelte'
    import StatusBar from './components/StatusBar.svelte'
    import HomeIndicator from './components/HomeIndicator.svelte'

    export let moment: Moment | undefined = undefined
</script>

<div class="justify-center overflow-auto">
    <div class="relative w-72 shrink-0 rounded-[44px] overflow-hidden border border-[#dfdbd7] flex flex-col">

        <StatusBar />

        <!-- scrollable content — rendered at real iPhone width (390 px) then zoomed to fit the frame -->
        <div class="overflow-y-auto min-h-126 bg-white overflow-x-hidden">
            <div style="width: 390px; zoom: {288 / 390};">
                {#if moment}
                    <Renderer node={moment.content.root} />
                {:else}
                    <div class="flex items-center justify-center h-64 text-[#0d0d0d]/20 text-sm tracking-wide">
                        no moment yet
                    </div>
                {/if}
            </div>
        </div>

        <HomeIndicator />
    </div>
</div>
