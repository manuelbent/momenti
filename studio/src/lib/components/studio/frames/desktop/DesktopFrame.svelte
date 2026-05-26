<script lang="ts">
    import { moment } from '$lib/stores/moment'
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

    <!-- header — fixed height, full width of the frame -->
    <div class="flex items-center gap-2 px-4 py-3 bg-[#e8e4de] border-b border-[#0d0d0d]/8 shrink-0">
        <span class="w-2.5 h-2.5 rounded-full bg-[#0d0d0d]/12"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#0d0d0d]/12"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#0d0d0d]/12"></span>
        <div class="flex-1 mx-4">
            <div class="bg-[#0d0d0d]/6 rounded-md px-3 py-1 text-[11px] text-[#0d0d0d]/35 tracking-wide w-full mx-auto text-center">
                https://{$moment?.slug}.momenti.cc
            </div>
        </div>
    </div>

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
