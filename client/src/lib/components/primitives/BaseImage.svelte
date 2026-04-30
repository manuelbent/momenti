<script lang="ts">
    export let src: string = ''
    export let alt: string = ''
    export let css: string = ''

    let fileInput: HTMLInputElement;

    function onFileSelected(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            src = URL.createObjectURL(target.files[0]);
        }
    }
</script>

<div class="momenti-img-container" style={css}>
    <img {src} {alt} class="main-img" />

    <button class="upload-overlay" onclick={() => fileInput.click()}>
        <div class="glass-pill">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Upload</span>
        </div>
    </button>

    <input type="file" accept="image/*" bind:this={fileInput} onchange={onFileSelected} hidden />
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

    .upload-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        border: none;
        cursor: pointer;
        z-index: 5; /* Ensure it stays above the image but potentially below the text */
    }

    .momenti-img-container:hover .upload-overlay {
        opacity: 1;
    }

    .glass-pill {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        padding: 8px 16px;
        border-radius: 100px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: sans-serif;
        font-size: 13px;
        font-weight: 500;
        color: #000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
</style>