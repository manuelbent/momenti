<script lang="ts">
    export let node: MomentNode
</script>

<div id={node.id} style={node.css}>
    <slot/>
</div>
