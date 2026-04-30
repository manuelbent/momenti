<script lang="ts">
    import BaseBox from '../components/primitives/BaseBox.svelte'
    import BaseText from '../components/primitives/BaseText.svelte'
    import BaseImage from '../components/primitives/BaseImage.svelte'
    import FormElement from '../components/primitives/FormElement.svelte'
    import BaseMap from '../components/primitives/BaseMap.svelte'

    export let node: MomentNode
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
            css={node.css ?? ''}
            inputCss={node.inputCss ?? ''}
            buttonCss={node.buttonCss ?? ''}
            placeholder={node.placeholder ?? 'Your name'}
            buttonLabel={node.buttonLabel ?? 'RSVP'}
    />
{:else if node.type === 'map'}
    <BaseMap address={node.address} css={node.css} />
{/if}
