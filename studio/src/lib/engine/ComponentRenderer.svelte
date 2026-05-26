<script lang="ts">
    import type { Component } from 'svelte'
    import Self from '$lib/engine/ComponentRenderer.svelte'
    import ActionButton from '$lib/engine/atoms/ActionButton.svelte'
    import TextBlock from '$lib/engine/atoms/TextBlock.svelte'

    let { node }: { node: ComponentNode } = $props()

    const componentRegistry: Record<string, Component<any>> = {
        action_button: ActionButton,
        text_block: TextBlock,
        // links_stack: LinksStack,
        // media_card: NestedCard
    }

    const TargetComponent = $derived(componentRegistry[node.type])
</script>

{#if TargetComponent}
    <TargetComponent data={node.data} overrides={node.stylingOverrides}>
        {#if node.children && node.children.length > 0}
            {#each node.children as childNode (childNode.id)}
                <Self node={childNode}/>
            {/each}
        {/if}
    </TargetComponent>
{/if}