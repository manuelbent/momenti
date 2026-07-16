<script lang="ts">
    import { submitForm } from '$lib/api/moments'
    import { responsiveStyle } from '$shared/responsiveStyle'

    export let node: MomentNode

    const [slug] = window.location.hostname.split('.')

    let values: Record<string, string> = {}
    let submitted = false
    let error = false

    const handleSubmit = async (e: Event) => {
        e.preventDefault()
        try {
            await submitForm(slug, node.id, values)
            submitted = true
        } catch (err) {
            console.error('[Form] submit error:', err)
            error = true
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<form use:responsiveStyle={{ css: node.css, mobileCss: node.mobileCss }} onsubmit={handleSubmit}>
    {#each node.fields ?? [] as field}
        {#if field.type === 'subject'}
            <p>{field.text}</p>

        {:else if field.type === 'radio'}
            <fieldset style="display: flex; gap: 1rem;">
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
                <input style={node.inputCss ?? ''}
                       type="text"
                       name={field.name}
                       placeholder={field.placeholder ?? ''}
                       bind:value={values[field.name]}
                       required
                />
            </label>
        {/if}
    {/each}

    <button type="submit"
            style="cursor: pointer; {node.buttonCss}"
            disabled={submitted}>
        {submitted ? '✓' : node.buttonLabel}
    </button>

    {#if error}
        <p style="font-style: italic;">Something went wrong. Please try again.</p>
    {/if}
</form>
