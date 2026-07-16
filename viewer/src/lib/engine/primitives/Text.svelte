<script lang="ts">
    import { onMount } from 'svelte'
    import { responsiveStyle } from '$shared/responsiveStyle'

    export let node: MomentNode

    let element: HTMLElement

    onMount(() => {
        element.innerHTML = node.html ?? ''
    })

    $: if (element && element.innerHTML !== (node.html ?? '')) {
        element.innerHTML = node.html ?? ''
    }
</script>

<svelte:element
        this={node.tag ?? 'p'}
        bind:this={element}
        use:responsiveStyle={{ css: node.css, mobileCss: node.mobileCss }}
/>
