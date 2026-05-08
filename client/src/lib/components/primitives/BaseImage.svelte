<script lang="ts">
    import { getContext } from 'svelte'

    export let id: string = ''
    export let src: string = ''
    export let alt: string = ''
    export let css: string = ''
    export let isSelected: boolean = false
    export let onSelect: (() => void) | undefined = undefined

    const viewOnly = getContext<boolean>('viewOnly') ?? false
</script>

<div class="momenti-img-container"
     class:momenti-selected={isSelected}
     id={id}
     data-nid={id}
     role="presentation"
     style={css}
     onclick={() => !viewOnly && onSelect?.()}
     onkeydown={() => {}}
>
    <img {src} {alt} class="main-img" />
</div>

<style>
    .momenti-img-container {
        position: relative;
        display: block;
        overflow: hidden;
    }

    .main-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
</style>