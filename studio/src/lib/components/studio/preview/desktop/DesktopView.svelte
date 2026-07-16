<script lang="ts">
    import { loadFonts } from '$shared/loadFonts'
    import { moment } from '$lib/stores/moment'
    import Renderer from '$lib/engine/StudioRenderer.svelte'
    import BrowserChrome from './components/BrowserChrome.svelte'

    $: loadFonts($moment?.content.fonts)

    const DESKTOP_WIDTH = 1280
    let containerWidth = 0
    $: scale = containerWidth > 0 ? containerWidth / DESKTOP_WIDTH : 1
</script>

<div class="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden border border-ink-accent shadow-2xl">

    <BrowserChrome slug={$moment?.slug ?? '<your-custom-slug>'} />

    <!-- content — rendered at true desktop width (1280 px) then zoomed to fit the frame -->
    <div class="flex-1 min-h-0 bg-white overflow-y-auto overflow-x-hidden" bind:clientWidth={containerWidth} style="transform: translate(0);">
        <div data-moment-viewport style="width: {DESKTOP_WIDTH}px; zoom: {scale}; container-type: inline-size;">
            {#if $moment}
                <Renderer node={$moment.content.root} />
            {:else}
                <div class="flex items-center justify-center h-64 text-ink/20 text-sm tracking-wide">
                    no moment yet
                </div>
            {/if}
        </div>
    </div>
</div>
