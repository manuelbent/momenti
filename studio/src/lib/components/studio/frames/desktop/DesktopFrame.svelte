<script lang="ts">
    import { onMount } from 'svelte'
    import { loadFonts } from '$shared/loadFonts'
    import { moment } from '$lib/stores/moment'
    import Renderer from '$lib/engine/Renderer.svelte'
    import BrowserChrome from './components/BrowserChrome.svelte'

    const DESKTOP_WIDTH = 1280
    let containerWidth = 0
    $: scale = containerWidth > 0 ? containerWidth / DESKTOP_WIDTH : 1

    onMount(() => {
        loadFonts($moment?.content.fonts)
    })
</script>

<div class="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-[#0d0d0d]/8 border border-[#0d0d0d]/8">

    <BrowserChrome slug={$moment?.slug ?? '<your-custom-slug>'} />

    <!-- content — rendered at true desktop width (1280 px) then zoomed to fit the frame -->
    <div class="flex-1 min-h-0 bg-white overflow-y-auto overflow-x-hidden" bind:clientWidth={containerWidth}>
        <div style="width: {DESKTOP_WIDTH}px; zoom: {scale};">
            {#if $moment}
                <Renderer node={$moment.content.root} />
            {:else}
                <div class="flex items-center justify-center h-64 text-[#0d0d0d]/20 text-sm tracking-wide">
                    no moment yet
                </div>
            {/if}
        </div>
    </div>
</div>
