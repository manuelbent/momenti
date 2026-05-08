<script lang="ts">
    import { getContext } from 'svelte'
    import { moment } from '$lib/stores/moment'
    import { submitForm } from '$lib/api'

    export let id: string = ''
    export let css: string = ''
    export let inputCss: string = ''
    export let buttonCss: string = ''
    export let buttonLabel: string = 'Send'
    export let fields: FormField[] = []
    export let isSelected: boolean = false
    export let onSelect: (() => void) | undefined = undefined

    const momentSlug = $moment?.slug ?? ''
    const viewOnly = getContext<boolean>('viewOnly') ?? false

    let values: Record<string, string> = {}
    let submitted = false
    let error = false

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        try {
            await submitForm(momentSlug, id, values)
            submitted = true
        } catch (err) {
            console.error('[FormElement] submit error:', err)
            error = true
        }
    }
</script>

<form data-nid={id}
      class:momenti-selected={isSelected}
      style={css}
      onsubmit={handleSubmit}
      onclick={() => !viewOnly && onSelect?.()}
>
    {#each fields as field}
        {#if field.type === 'subject'}
            <p>{field.text}</p>

        {:else if field.type === 'radio'}
            <fieldset>
                {#if field.label}
                    <legend>{field.label}</legend>
                {/if}
                {#each field.options as opt}
                    <label style="cursor: pointer">
                        <input type="radio"
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
                <input style={inputCss}
                       type="text"
                       name={field.name}
                       placeholder={field.placeholder ?? ''}
                       bind:value={values[field.name]}
                       required
                />
            </label>
        {/if}
    {/each}

    <button type="submit" style="cursor: pointer; {buttonCss}">{buttonLabel}</button>
    <div style={css}>
        {#if submitted}
            <p style="font-style: italic;">✓</p>
        {:else if error}
            <p style="font-style: italic;">Something went wrong. Please try again.</p>
        {/if}
    </div>
</form>

<style>
    fieldset {
        display: flex;
        gap: 2rem;
    }
</style>
