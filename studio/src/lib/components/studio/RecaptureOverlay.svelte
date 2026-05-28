<script lang="ts">
    import { fade } from 'svelte/transition'
    import Loader from '$lib/components/landing/components/Loader.svelte'

    export let streamText: string = ''
</script>

<div
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#f0ede8]/50 backdrop-blur-sm"
    transition:fade={{ duration: 300 }}
    aria-live="polite"
    aria-label="Re-capturing your moment"
>
    <Loader {streamText} theme="light" />
</div>
