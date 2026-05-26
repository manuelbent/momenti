<script lang="ts">
    import { moment } from '$lib/stores/moment'
    import BrowserChrome from './components/BrowserChrome.svelte'
    import CanvasRenderer from '$lib/engine/CanvasRenderer.svelte'

    const DESKTOP_WIDTH = 1280
    let containerWidth = 0
    $: scale = containerWidth > 0 ? containerWidth / DESKTOP_WIDTH : 1
</script>

<svelte:head>
    {#if $moment}
        <link rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family={$moment.content.globalTheme.fonts.heading}:wght@400;600;700&family={$moment.content.globalTheme.fonts.body}:wght@400;500&display=swap">
    {/if}
</svelte:head>

<div class="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-[#0d0d0d]/8 border border-[#0d0d0d]/8">

    <BrowserChrome slug={$moment?.slug}/>

    <!-- content — rendered at true desktop width (1280 px) then zoomed to fit the frame -->
    <div class="flex-1 min-h-0 bg-white overflow-y-auto overflow-x-hidden" bind:clientWidth={containerWidth}>
        <div style="width: {DESKTOP_WIDTH}px; zoom: {scale};">
            {#if $moment}
                <div style="
                        --color-primary: {$moment.content.globalTheme.tokens.brandPrimary};
                        --color-secondary: {$moment.content.globalTheme.tokens.brandSecondary};
                        --bg-global: {$moment.content.globalTheme.tokens.bgGlobal};
                        --text-global: {$moment.content.globalTheme.tokens.textGlobal};
                        --font-heading: '{$moment.content.globalTheme.fonts.heading}', sans-serif;
                        --font-body: '{$moment.content.globalTheme.fonts.body}', sans-serif;
                        --borderRadiusGlobal: var(--radius-{$moment.content.globalTheme.tokens.borderRadiusGlobal || 'md'});
                    "
                     class="min-h-full bg-(--bg-global) text-(--text-global) font-(family-name:--font-body)"
                >
                    <CanvasRenderer canvas={$moment.content.canvas}/>
                </div>
            {:else}
                <div class="flex items-center justify-center h-64 text-[#0d0d0d]/20 text-sm tracking-wide">
                    no moment yet
                </div>
            {/if}
        </div>
    </div>
</div>
