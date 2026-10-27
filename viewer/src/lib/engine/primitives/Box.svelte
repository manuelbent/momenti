<script lang="ts">
    export let node: MomentNode
</script>

<div id={node.id} data-nid={node.id} data-layout={node.layout}
     style={node.css} style:--moment-columns={node.columns ?? 2}>
    <slot/>
</div>
