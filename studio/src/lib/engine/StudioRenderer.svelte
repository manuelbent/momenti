<script lang="ts">
    import type { Component } from 'svelte'
    import { sidebarMode } from '$lib/stores/sidebarMode'

    // pure primitives
    import Box        from '$lib/engine/primitives/Box.svelte'
    import Text       from '$lib/engine/primitives/Text.svelte'
    import Image      from '$lib/engine/primitives/Image.svelte'
    import Carousel   from '$lib/engine/primitives/Carousel.svelte'
    import Form       from '$lib/engine/primitives/Form.svelte'
    import Map        from '$lib/engine/primitives/Map.svelte'
    import Countdown  from '$lib/engine/primitives/Countdown.svelte'
    import Link       from '$lib/engine/primitives/Link.svelte'
    import Navbar     from '$lib/engine/primitives/Navbar.svelte'
    import Footer     from '$lib/engine/primitives/Footer.svelte'

    // studio interactive components
    import SelectableBox       from '$lib/engine/studio/SelectableBox.svelte'
    import EditableText        from '$lib/engine/studio/EditableText.svelte'
    import UploadableImage     from '$lib/engine/studio/UploadableImage.svelte'
    import UploadableCarousel  from '$lib/engine/studio/UploadableCarousel.svelte'

    export let node: MomentNode

    // shared components across all modes
    const shared = { form: Form, map: Map, countdown: Countdown, link: Link, navbar: Navbar, footer: Footer }
    // components for settings: all interactive, allowing content editing and section selection
    const settingsMap = { ...shared, text: EditableText,  image: UploadableImage, carousel: UploadableCarousel, box: SelectableBox }
    // components for changes: mostly static, allowing only section selection and content editing for text and images
    const changesMap  = { ...shared, text: Text,          image: Image,           carousel: Carousel,           box: SelectableBox }
    // components for moments: purely static, no interactivity
    const staticMap   = { ...shared, text: Text,          image: Image,           carousel: Carousel,           box: Box }

    const componentsMap: Record<string, Record<string, Component<any>>> = {
        settings: settingsMap,
        changes:  changesMap,
        moments:  staticMap
    }

    $: component = componentsMap[$sidebarMode]?.[node.type]
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

