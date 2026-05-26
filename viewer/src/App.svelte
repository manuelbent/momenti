<script lang="ts">
    import { onMount } from 'svelte'
    import { getMomentBySlug } from '$lib/api/moments'

    import NotFound from '$lib/components/NotFound.svelte'
    import CanvasRenderer from '$lib/engine/CanvasRenderer.svelte'

    let moment: Moment|null = null
    let loading = true

    onMount(async () => {
        const [slug] = window.location.hostname.split('.')
        moment = await getMomentBySlug(slug)
        document.title = moment?.slug || document.title
        loading = false
    })
</script>

<svelte:head>
    {#if moment}
        <link rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family={moment.content.globalTheme.fonts.heading}:wght@400;600;700&family={moment.content.globalTheme.fonts.body}:wght@400;500&display=swap">
    {/if}
</svelte:head>

{#if loading}
    <!--  -->
{:else if moment}
    <div style="
            --color-primary: {moment.content.globalTheme.tokens.brandPrimary};
            --color-secondary: {moment.content.globalTheme.tokens.brandSecondary};
            --bg-global: {moment.content.globalTheme.tokens.bgGlobal};
            --text-global: {moment.content.globalTheme.tokens.textGlobal};
            --font-heading: '{moment.content.globalTheme.fonts.heading}', sans-serif;
            --font-body: '{moment.content.globalTheme.fonts.body}', sans-serif;
            --borderRadiusGlobal: var(--radius-{moment.content.globalTheme.tokens.borderRadiusGlobal || 'md'});
        "
         class="min-h-full bg-(--bg-global) text-(--text-global) font-(family-name:--font-body)"
    >
        <CanvasRenderer canvas={moment.content.canvas}/>
    </div>
{:else}
    <NotFound/>
{/if}
