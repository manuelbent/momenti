<script lang="ts">
    import { getContext } from 'svelte'

    export let node: MomentNode
    export let parentId: string = '' // kept for Renderer compatibility

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    let values: Record<string, string> = {}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
<form data-nid={node.id}
      style={node.css}
>
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
                        />
                        {opt.label}
                    </label>
                {/each}
            </fieldset>

        {:else if field.type === 'input'}
            <label>
                {#if field.label}<span>{field.label}</span>{/if}
                <input style={node.inputCss}
                       type="text"
                       name={field.name}
                       placeholder={field.placeholder}
                       bind:value={values[field.name]}
                />
            </label>
        {/if}
    {/each}

    <button style="cursor: pointer; {node.buttonCss}" onclick={e => e.preventDefault()}>
        {node.buttonLabel}
    </button>
</form>
