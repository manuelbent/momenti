<script lang="ts">
    export let css: string = ''
    export let placeholder: string = 'Your name'
    export let buttonLabel: string = 'RSVP'

    let name = ''
    let submitted = false

    function handleSubmit() {
        if (name.trim()) submitted = true
    }
</script>

{#if submitted}
    <p style={css}>Thanks, {name}! See you there.</p>
{:else}
    <form style={css} on:submit|preventDefault={handleSubmit}>
        <input bind:value={name} placeholder={placeholder}/>
        <button type="submit">{buttonLabel}</button>
    </form>
{/if}
