<script lang="ts">
    import { onMount } from 'svelte'

    export let tag: string = 'p'
    export let html: string = ''
    export let css: string = ''

    let element: HTMLElement

    onMount(() => {
        element.innerHTML = html
    })

    $: if (element && element.innerHTML !== html) {
        element.innerHTML = html
    }
</script>

<svelte:element
        this={tag}
        bind:this={element}
        style={css}
/>
