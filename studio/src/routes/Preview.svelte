<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { moment } from '$lib/stores/moment'
    import CanvasRenderer from '$lib/engine/CanvasRenderer.svelte'

    onMount(async () => {
        try {
            const m: Moment = JSON.parse(localStorage.getItem('moment__preview')!)
            moment.set(m)
        } catch (err) {
            console.error('[Preview] Could not parse moment for preview.', err)
        }
    })
</script>

<svelte:head>
    {#if $moment}
        <link rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family={$moment.content.globalTheme.fonts.heading}:wght@400;600;700&family={$moment.content.globalTheme.fonts.body}:wght@400;500&display=swap">
    {/if}
</svelte:head>

{#if $moment}
    <div in:fade={{ duration: 400 }} style="position: relative">
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
    </div>
{/if}
