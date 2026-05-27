<script lang="ts">
    import Navbar from '$lib/components/studio/components/Navbar.svelte'
    import Toast from '$lib/components/ui/Toast.svelte'
    import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte'
</script>

<div class="h-screen text-[#0d0d0d] bg-[#f0ede8] flex flex-col overflow-hidden">
    <Navbar/>

    <main class="flex flex-1 min-h-0">
        <slot/>
    </main>
</div>

<Toast/>

<LoadingOverlay/>
