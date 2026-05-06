<script lang="ts">
    import { getContext } from 'svelte'

    export let css: string = ''
    export let inputCss: string = ''
    export let buttonCss: string = ''
    export let buttonLabel: string = 'Send'
    export let fields: FormField[] = []

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    let values: Record<string, string> = {}
    let submitted = false

    function handleSubmit() {
        submitted = true
    }
</script>


<form style={css} on:submit|preventDefault={handleSubmit}>
    {#each fields as field}
        {#if field.type === 'subject'}
            <p>{field.text}</p>

        {:else if field.type === 'radio'}
            <fieldset>
                {#if field.label}
                    <legend>{field.label}</legend>
                {/if}
                {#each field.options as opt}
                    <label>
                        <input
                                type="radio"
                                name={field.name}
                                value={opt.value}
                                bind:group={values[field.name]}
                                required
                        />
                        {opt.label}
                    </label>
                {/each}
            </fieldset>

        {:else if field.type === 'input'}
            <label>
                {#if field.label}<span>{field.label}</span>{/if}
                <input
                        style={inputCss}
                        type="text"
                        name={field.name}
                        placeholder={field.placeholder ?? ''}
                        bind:value={values[field.name]}
                        required
                />
            </label>
        {/if}
    {/each}

    <button type="submit" style={buttonCss}>{buttonLabel}</button>
</form>

<style>
    fieldset {
        display: flex;
        gap: 2rem;
    }
</style>
