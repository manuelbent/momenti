<script context="module" lang="ts">
    let pageSequence = 0
</script>

<script lang="ts">
    import { PAGE_BASE_STYLES, scopePageStyles } from './pageStyles'

    export let stylesheet: string|undefined = undefined

    const scope = `moment-${++pageSequence}`
    const baseStyles = scopePageStyles(PAGE_BASE_STYLES, scope)
    let styleElement: HTMLStyleElement|undefined
    let compiled = ''
    let error = ''

    $: {
        try {
            compiled = stylesheet === undefined ? '' : baseStyles + scopePageStyles(stylesheet, scope)
            error = ''
        } catch (cause) {
            compiled = ''
            error = cause instanceof Error ? cause.message : 'Invalid page stylesheet.'
            console.error('[MomentPage] Could not apply page styles:', cause)
        }
    }

    $: if (styleElement) styleElement.textContent = compiled

    function attachStyles(element: HTMLElement) {
        styleElement = document.createElement('style')
        styleElement.textContent = compiled
        element.prepend(styleElement)

        return {
            destroy() {
                styleElement?.remove()
                styleElement = undefined
            },
        }
    }
</script>

{#if stylesheet === undefined}
    <slot/>
{:else}
    <div data-moment-page={scope} class="moment-page" use:attachStyles>
        {#if error}
            <p role="alert">This page's styles could not be displayed: {error}</p>
        {:else}
            <slot/>
        {/if}
    </div>
{/if}

<style>
    .moment-page {
        container: moment / inline-size;
        position: relative;
        isolation: isolate;
        contain: layout style;
        overflow: clip;
        width: 100%;
        min-width: 0;
    }
</style>
