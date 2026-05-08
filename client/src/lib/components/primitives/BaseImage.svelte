<script lang="ts">
    import { getContext } from 'svelte'
    import { Upload, Trash2 } from 'lucide-svelte'
    import { deleteNode } from '$lib/stores/moment'

    export let id: string = ''
    export let src: string = ''
    export let alt: string = ''
    export let css: string = ''

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    let fileInput: HTMLInputElement;

    const onFileSelected = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            src = URL.createObjectURL(target.files[0]);
        }
    }
</script>

<div class="momenti-img-container" style={css}>
    <img {src} {alt} class="main-img" />

    {#if !viewOnly}
        <div class="overlay">
            <button class="overlay-button" onclick={() => fileInput.click()}>
                <Upload class="h-4"/>
            </button>
            <button class="overlay-button text-red-800" onclick={() => deleteNode(id)}>
                <Trash2 class="h-4"/>
            </button>
        </div>

        <input type="file" accept="image/*" bind:this={fileInput} onchange={onFileSelected} hidden />
    {/if}
</div>

<style>
    .momenti-img-container {
        position: relative;
        display: block;
        overflow: hidden;
        group: hover; /* Logic for the overlay */
    }

    .main-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
    }

    .overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        border: none;
        z-index: 5;
        gap: 8px;
    }

    .momenti-img-container:hover .overlay {
        opacity: 1;
    }

    .overlay-button {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 8px 7px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: sans-serif;
        font-size: 13px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        cursor: pointer;
    }
</style>