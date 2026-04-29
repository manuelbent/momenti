<script lang="ts">
    export let address: string = '';
    export let css: string = '';

    // We use the public embed URL which only needs a q (query) parameter
    $: encodedAddress = encodeURIComponent(address);
    $: mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
</script>

<div class="momento-map-container" style={css}>
    {#if address}
        <iframe
                title="Map for {address}"
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
    .momento-map-container {
        position: relative;
        overflow: hidden;
        background: #f8f8f8;
        /* Ensure the map has a default height if the AI forgets to provide it */
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