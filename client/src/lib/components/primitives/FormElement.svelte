<script lang="ts">
    export let css: string = ''
    export let inputCss: string = ''
    export let buttonCss: string = ''
    export let placeholder: string = 'Your name'
    export let buttonLabel: string = 'RSVP'

    let name = ''
    let submitted = false
</script>

{#if submitted}
    <div style={css}>
        <p style="font-style: italic;">Thank you!</p>
    </div>
{:else}
    <form style={css} on:submit|preventDefault={() => (submitted = true)}>
        <input style={inputCss} bind:value={name} {placeholder} required />
        <button type="submit" style={buttonCss}>{buttonLabel}</button>
    </form>
{/if}
