<script lang="ts">
    import { setContext, hasContext } from 'svelte'
    import Box from '$lib/engine/primitives/Box.svelte'
    import Text from '$lib/engine/primitives/Text.svelte'
    import Image from '$lib/engine/primitives/Image.svelte'
    import Form from '$lib/engine/primitives/Form.svelte'
    import Map from '$lib/engine/primitives/Map.svelte'
    import Countdown from '$lib/engine/primitives/Countdown.svelte'
    import Link from '$lib/engine/primitives/Link.svelte'

    export let node: MomentNode
    export let viewOnly: boolean = false
    export let parentId: string = ''

    const isRoot = !hasContext('viewOnly')

    if (isRoot) {
        setContext('viewOnly', viewOnly)
    }
</script>

{#if node.type === 'box'}
    <Box {node}>
        {#each node.children ?? [] as child (child.id)}
            <svelte:self node={child} parentId={node.id}/>
        {/each}
    </Box>
{:else if node.type === 'text'}
    <Text {node} />
{:else if node.type === 'image'}
    <Image {node} />
{:else if node.type === 'form'}
    <Form {node} {parentId} />
{:else if node.type === 'map'}
    <Map {node} />
{:else if node.type === 'countdown'}
    <Countdown {node} />
{:else if node.type === 'link'}
    <Link {node} />
{/if}
