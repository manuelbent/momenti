<script lang="ts">
    import { setContext, hasContext } from 'svelte'
    import { selectNode, selectedNodeId } from '$lib/stores/moment'
    import BaseBox from '$lib/components/primitives/BaseBox.svelte'
    import BaseText from '$lib/components/primitives/BaseText.svelte'
    import BaseImage from '$lib/components/primitives/BaseImage.svelte'
    import FormElement from '$lib/components/primitives/FormElement.svelte'
    import BaseMap from '$lib/components/primitives/BaseMap.svelte'

    export let node: MomentNode
    export let viewOnly: boolean = false
    export let parentId: string = ''

    // only set the context at the root Renderer instance
    // recursive svelte:self children inherit it automatically
    if (!hasContext('viewOnly')) {
        setContext('viewOnly', viewOnly)
    }
</script>

{#if node.type === 'box'}
    <BaseBox css={node.css ?? ''}>
        {#each node.children ?? [] as child (child.id)}
            <svelte:self node={child} parentId={node.id}/>
        {/each}
    </BaseBox>
{:else if node.type === 'text'}
    <BaseText
            id={node.id}
            tag={node.tag ?? 'p'}
            html={node.html ?? ''}
            css={node.css ?? ''}
            isSelected={!viewOnly && $selectedNodeId === node.id}
            onSelect={() => selectNode({ id: node.id, type: node.type, deleteId: node.id })}
    />
{:else if node.type === 'image'}
    <BaseImage
            id={node.id ?? ''}
            src={node.src ?? ''}
            alt={node.alt ?? ''}
            css={node.css ?? ''}
            isSelected={!viewOnly && $selectedNodeId === node.id}
            onSelect={() => selectNode({ id: node.id, type: node.type, deleteId: node.id })}
    />
{:else if node.type === 'form'}
    <FormElement
            id={node.id}
            css={node.css ?? ''}
            inputCss={node.inputCss ?? ''}
            buttonCss={node.buttonCss ?? ''}
            buttonLabel={node.buttonLabel ?? 'Send'}
            fields={node.fields ?? []}
            isSelected={!viewOnly && $selectedNodeId === node.id}
            onSelect={() => selectNode({ id: node.id, type: node.type, deleteId: parentId || node.id })}
    />
{:else if node.type === 'map'}
    <BaseMap
            id={node.id}
            address={node.address}
            css={node.css}
            isSelected={!viewOnly && $selectedNodeId === node.id}
            onSelect={() => selectNode({ id: node.id, type: node.type, deleteId: node.id })}
    />
{/if}
