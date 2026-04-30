<script lang="ts">
    import Renderer from '../../../../engine/Renderer.svelte'
    import StatusBar from './components/StatusBar.svelte'
    import HomeIndicator from './components/HomeIndicator.svelte'

    export let moment: Moment | undefined = undefined
</script>

<div class="justify-center overflow-auto">
    <div class="relative w-72 shrink-0 rounded-[44px] overflow-hidden border border-[#dfdbd7] flex flex-col">

        <StatusBar />

        <!-- scrollable content -->
        <div class="overflow-y-auto min-h-126 bg-white">
            {#if moment}
                <Renderer node={moment.content.root} />
            {:else}
                <div class="flex items-center justify-center h-64 text-[#0d0d0d]/20 text-sm tracking-wide">
                    no moment yet
                </div>
            {/if}
        </div>

        <HomeIndicator />
    </div>
</div>
