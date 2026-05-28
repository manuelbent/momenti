<script lang="ts">
    import Box from '$lib/engine/primitives/Box.svelte'
    import Text from '$lib/engine/primitives/Text.svelte'
    import Image from '$lib/engine/primitives/Image.svelte'
    import Form from '$lib/engine/primitives/Form.svelte'
    import Map from '$lib/engine/primitives/Map.svelte'
    import Countdown from '$lib/engine/primitives/Countdown.svelte'
    import Link from '$lib/engine/primitives/Link.svelte'

    export let node: MomentNode

    const components: Record<string, any> = {
        box: Box,
        text: Text,
        image: Image,
        form: Form,
        map: Map,
        countdown: Countdown,
        link: Link,
    }

    $: component = components[node.type]
</script>

{#if node.type === 'box'}
    <svelte:component this={component} {node}>
        {#each node.children ?? [] as child (child.id)}
            <svelte:self node={child} parentId={node.id}/>
        {/each}
    </svelte:component>
{:else}
    <svelte:component this={component} {node}/>
{/if}
