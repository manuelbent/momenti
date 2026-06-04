<script lang="ts">
    export let node: MomentNode
</script>

<div class="momenti-img-container" id={node.id} data-nid={node.id} style={node.css ?? ''}>
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
