<script lang="ts">
    import type { Component } from 'svelte'
    import Self from '$lib/engine/ComponentRenderer.svelte'
    import ActionButton from '$lib/engine/atoms/ActionButton.svelte'
    import TextBlock from '$lib/engine/atoms/TextBlock.svelte'
    import MediaCard from '$lib/engine/atoms/MediaCard.svelte'
    import LinksStack from '$lib/engine/atoms/LinksStack.svelte'
    import InteractiveForm from '$lib/engine/atoms/InteractiveForm.svelte'

    let { node }: { node: ComponentNode } = $props()

    const componentRegistry: Record<string, Component<any>> = {
        action_button: ActionButton,
        text_block: TextBlock,
        media_card: MediaCard,
        links_stack: LinksStack,
        interactive_form: InteractiveForm,
    }

    const TargetComponent = $derived(componentRegistry[node.type])
</script>

{#snippet childrenSnippet()}
    {#each node.children ?? [] as childNode (childNode.id)}
        <Self node={childNode}/>
    {/each}
{/snippet}

{#if TargetComponent}
    <TargetComponent
        data={node.data}
        overrides={node.stylingOverrides}
        children={node.children?.length ? childrenSnippet : undefined}
    />
{/if}