<script lang="ts">
    import { setContext, hasContext } from 'svelte'
    import BaseBox from '$lib/components/primitives/BaseBox.svelte'
    import BaseText from '$lib/components/primitives/BaseText.svelte'
    import BaseImage from '$lib/components/primitives/BaseImage.svelte'
    import FormElement from '$lib/components/primitives/FormElement.svelte'
    import BaseMap from '$lib/components/primitives/BaseMap.svelte'

    export let node: MomentNode
    export let viewOnly: boolean = false

    // only set the context at the root Renderer instance
    // recursive svelte:self children inherit it automatically
    if (!hasContext('viewOnly')) {
        setContext('viewOnly', viewOnly)
    }
</script>

{#if node.type === 'box'}
    <BaseBox css={node.css ?? ''}>
        {#each node.children ?? [] as child (child.id)}
            <svelte:self node={child}/>
        {/each}
    </BaseBox>
{:else if node.type === 'text'}
    <BaseText
            id={node.id}
            tag={node.tag ?? 'p'}
            html={node.html ?? ''}
            css={node.css ?? ''}
    />
{:else if node.type === 'image'}
    <BaseImage src={node.src ?? ''} alt={node.alt ?? ''} css={node.css ?? ''}/>
{:else if node.type === 'form'}
    <FormElement
            id={node.id}
            css={node.css ?? ''}
            inputCss={node.inputCss ?? ''}
            buttonCss={node.buttonCss ?? ''}
            buttonLabel={node.buttonLabel ?? 'Send'}
            fields={node.fields ?? []}
    />
{:else if node.type === 'map'}
    <BaseMap address={node.address} css={node.css} />
{/if}
