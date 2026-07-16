<script lang="ts">
    import { responsiveStyle } from '$shared/responsiveStyle'

    export let node: MomentNode
</script>

<div class="relative block overflow-hidden"
     id={node.id}
     data-nid={node.id}
     use:responsiveStyle={{ css: node.css, mobileCss: node.mobileCss }}>
    <img src={node.src} alt={node.alt} class="main-img" />
</div>

<style>
    .main-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }
</style>
