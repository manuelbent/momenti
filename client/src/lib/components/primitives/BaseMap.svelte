<script lang="ts">
    import { getContext } from 'svelte'

    export let id: string = ''
    export let address: string = '';
    export let css: string = '';
    export let isSelected: boolean = false
    export let onSelect: (() => void) | undefined = undefined

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    // We use the public embed URL which only needs a q (query) parameter
    $: encodedAddress = encodeURIComponent(address);
    $: mapUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div class="momenti-map-container"
     class:momenti-selected={isSelected}
     id={id}
     data-nid={id}
     style={css ?? ''}
     onclick={() => !viewOnly && onSelect?.()}
>
    {#if address}
        <!-- click-shield so the iframe doesn't capture builder clicks -->
        {#if !viewOnly}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <div class="map-click-shield" onpointerdown={(e) => { e.stopPropagation(); onSelect?.() }}></div>
        {/if}
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
    .momenti-map-container {
        position: relative;
        overflow: hidden;
        background: #f8f8f8;
        /* Ensure the map has a default height if the AI forgets to provide it */
        min-height: 300px;
    }

    .map-click-shield {
        position: absolute;
        inset: 0;
        z-index: 1;
        cursor: pointer;
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