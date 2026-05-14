<script lang="ts">
    import BaseBox from '$lib/components/primitives/BaseBox.svelte'
    import BaseText from '$lib/components/primitives/BaseText.svelte'
    import BaseImage from '$lib/components/primitives/BaseImage.svelte'
    import FormElement from '$lib/components/primitives/FormElement.svelte'
    import BaseMap from '$lib/components/primitives/BaseMap.svelte'

    export let node: MomentNode
</script>

{#if node.type === 'box'}
    <BaseBox css={node.css ?? ''}>
        {#each node.children ?? [] as child (child.id)}
            <svelte:self node={child} parentId={node.id}/>
        {/each}
    </BaseBox>
{:else if node.type === 'text'}
    <BaseText
            tag={node.tag ?? 'p'}
            html={node.html ?? ''}
            css={node.css ?? ''}
    />
{:else if node.type === 'image'}
    <BaseImage
            src={node.src ?? ''}
            alt={node.alt ?? ''}
            css={node.css ?? ''}
    />
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
    <BaseMap
            address={node.address}
            css={node.css}
    />
{/if}
