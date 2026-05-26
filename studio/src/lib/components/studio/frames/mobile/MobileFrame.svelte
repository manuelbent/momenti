<script lang="ts">
    import { moment } from '$lib/stores/moment'
    import StatusBar from './components/StatusBar.svelte'
    import CanvasRenderer from '$lib/engine/CanvasRenderer.svelte'

    // Real structural viewport boundaries for standard modern iPhone frames
    const IPHONE_WIDTH = 390
    const FRAME_WIDTH = 288

    // Exact structural scale modifier metric
    const targetScale = FRAME_WIDTH / IPHONE_WIDTH; // ~0.7384

    // Explicitly calculate scaled layout boundary boxes to avoid parent frame tracking bugs
    const scaledHeight = 504 / targetScale; // Fits into h-126 (504px) perfectly
</script>

<svelte:head>
    {#if $moment}
        <link rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family={$moment.content.globalTheme.fonts.heading}:wght@400;600;700&family={$moment.content.globalTheme.fonts.body}:wght@400;500&display=swap">
    {/if}
</svelte:head>

<div class="flex justify-center items-center w-full overflow-hidden">
    <div class="relative w-[288px] h-[504px] shrink-0 rounded-[44px] border border-[#dfdbd7] flex flex-col bg-white overflow-hidden shadow-xl">

        <StatusBar/>

        <div class="flex-1 overflow-y-auto overflow-x-hidden w-full h-full relative bg-white">
            {#if $moment}
                <div
                        style="
                        width: {IPHONE_WIDTH}px;
                        min-height: {scaledHeight}px;
                        transform: scale({targetScale});
                        transform-origin: top left;
                        --color-primary: {$moment.content.globalTheme.tokens.brandPrimary};
                        --color-secondary: {$moment.content.globalTheme.tokens.brandSecondary};
                        --bg-global: {$moment.content.globalTheme.tokens.bgGlobal};
                        --text-global: {$moment.content.globalTheme.tokens.textGlobal};
                        --font-heading: '{$moment.content.globalTheme.fonts.heading}', sans-serif;
                        --font-body: '{$moment.content.globalTheme.fonts.body}', sans-serif;
                        --borderRadiusGlobal: var(--radius-{$moment.content.globalTheme.tokens.borderRadiusGlobal || 'md'});
                    "
                        class="absolute top-0 left-0 bg-(--bg-global) text-(--text-global) font-(family-name:--font-body)"
                >
                    <CanvasRenderer canvas={$moment.content.canvas}/>
                </div>
            {:else}
                <div class="flex items-center justify-center h-full text-[#0d0d0d]/20 text-sm tracking-wide">
                    no moment yet
                </div>
            {/if}
        </div>
    </div>
</div>