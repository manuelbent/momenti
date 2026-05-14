<script lang="ts">
    export let src: string = ''
    export let alt: string = ''
    export let css: string = ''
</script>

<div class="momenti-img-container"
     style={css}
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
