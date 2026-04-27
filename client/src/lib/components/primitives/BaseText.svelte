<script lang="ts">
    export let tag: string = 'p'
    export let html: string = ''
    export let css: string = ''
</script>

<svelte:element this={tag} style={css}>{@html html}</svelte:element>
