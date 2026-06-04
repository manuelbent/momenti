<script lang="ts">
    import { sidebarMode } from '$lib/stores/sidebarMode'

    // Pure primitives
    import Text       from '$lib/engine/primitives/Text.svelte'
    import Image      from '$lib/engine/primitives/Image.svelte'
    import Carousel   from '$lib/engine/primitives/Carousel.svelte'
    import Form       from '$lib/engine/primitives/Form.svelte'
    import Map        from '$lib/engine/primitives/Map.svelte'
    import Countdown  from '$lib/engine/primitives/Countdown.svelte'
    import Link       from '$lib/engine/primitives/Link.svelte'
    import Navbar     from '$lib/engine/primitives/Navbar.svelte'
    import Footer     from '$lib/engine/primitives/Footer.svelte'

    // Studio interactive components
    import SelectableBox       from '$lib/engine/studio/SelectableBox.svelte'
    import EditableText        from '$lib/engine/studio/EditableText.svelte'
    import UploadableImage     from '$lib/engine/studio/UploadableImage.svelte'
    import UploadableCarousel  from '$lib/engine/studio/UploadableCarousel.svelte'

    export let node: MomentNode

    // Shared leaf components — the same in every mode
    const shared = { form: Form, map: Map, countdown: Countdown, link: Link, navbar: Navbar, footer: Footer }

    // settings → edit text + upload images; sections are plain
    const settingsMap = { ...shared, text: EditableText,  image: UploadableImage, carousel: UploadableCarousel, box: SelectableBox }

    // changes  → select sections; content is read-only
    const changesMap  = { ...shared, text: Text,          image: Image,           carousel: Carousel,           box: SelectableBox }

    // moments / anything else → fully static
    const staticMap   = { ...shared, text: Text,          image: Image,           carousel: Carousel,           box: SelectableBox }

    $: components = $sidebarMode === 'settings' ? settingsMap
                  : $sidebarMode === 'changes'  ? changesMap
                  : staticMap

    $: component = components[node.type as keyof typeof components]
</script>

{#if node.type === 'box'}
    <svelte:component this={component} {node}>
        {#each node.children ?? [] as child (child.id)}
            <svelte:self node={child}/>
        {/each}
    </svelte:component>
{:else}
    <svelte:component this={component} {node}/>
{/if}

