<script lang="ts">
    import { responsiveStyle } from '$shared/responsiveStyle'

    export let node: MomentNode
</script>

<div class="momenti-img-container" use:responsiveStyle={{ css: node.css, mobileCss: node.mobileCss }}>
    <img src={node.src ?? ''} alt={node.alt ?? ''} class="main-img" />
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
