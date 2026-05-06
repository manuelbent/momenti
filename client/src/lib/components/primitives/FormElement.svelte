<script lang="ts">
    import { getContext } from 'svelte'

    export let css: string
    export let inputCss: string
    export let buttonCss: string
    export let placeholder: string
    export let buttonLabel: string

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    let value: string
    let submitted = false
</script>

{#if submitted}
    <div style={css}>
        <p style="font-style: italic;">Thank you!</p>
    </div>
{:else}
    <form style={css} on:submit|preventDefault={() => (submitted = true)}>
        <input style={inputCss} bind:value {placeholder} required disabled={viewOnly} />
        <button type="submit" style={buttonCss} disabled={viewOnly}>{buttonLabel}</button>
    </form>
{/if}
