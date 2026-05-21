<script lang="ts">
    import BaseBox from '$lib/components/primitives/BaseBox.svelte'
    import BaseText from '$lib/components/primitives/BaseText.svelte'
    import BaseImage from '$lib/components/primitives/BaseImage.svelte'
    import FormElement from '$lib/components/primitives/FormElement.svelte'
    import BaseMap from '$lib/components/primitives/BaseMap.svelte'
    import BaseCountdown from '$lib/components/primitives/BaseCountdown.svelte'
    import BaseLink from '$lib/components/primitives/BaseLink.svelte'

    export let node: MomentNode
</script>

{#if node.type === 'box'}
    <!-- We check if layout is column/row and make sure it's injected if the CSS string doesn't explicitly overwrite it already -->
    {@const layoutCss = node.layout === 'column' ? 'flex-direction: column;' : node.layout === 'row' ? 'flex-direction: row;' : ''}

    <BaseBox css="{node.css ?? ''}; {layoutCss}">
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
{:else if node.type === 'countdown'}
    <BaseCountdown
            targetDate={node.targetDate ?? ''}
            css={node.css ?? ''}
    />
{:else if node.type === 'link'}
    <BaseLink
            href={node.href ?? ''}
            html={node.html ?? ''}
            platform={node.platform}
            css={node.css ?? ''}
    />
{/if}
