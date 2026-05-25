<script lang="ts">
    export let node: MomentNode

    $: encodedAddress = encodeURIComponent(node.address ?? '')
    $: mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`
</script>

<div class="momenti-map-container" style={node.css ?? ''}>
    {#if node.address}
        <iframe
                title="Map for {node.address}"
                width="100%"
                height="100%"
                style="border:0;"
                src={mapUrl}
                allowfullscreen
                loading="lazy"
        ></iframe>
    {:else}
        <div class="map-placeholder">
            <p>Indirizzo non specificato</p>
        </div>
    {/if}
</div>

<style>
    .momenti-map-container {
        position: relative;
        overflow: hidden;
        background: #f8f8f8;
        min-height: 300px;
    }

    .map-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #a0a0a0;
        font-family: 'Inter', sans-serif;
        font-style: italic;
    }
</style>
