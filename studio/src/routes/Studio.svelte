<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Navbar from '$lib/components/studio/components/Navbar.svelte'
    import Frame from '$lib/components/studio/frames/Frame.svelte'
    import Sidebar from '$lib/components/studio/sidebar/Sidebar.svelte'
    import Toast from '$lib/components/ui/Toast.svelte'
    import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte'

    onMount(() => {
        if (!$inviteKey) {
            replace('/')
        }
    })
</script>

<div class="h-screen text-[#0d0d0d] bg-[#f0ede8] flex flex-col overflow-hidden">

    <Navbar/>

    <main class="flex flex-1 min-h-0">

        <Frame/>

        <aside class="w-92 border-l border-[#0d0d0d]/6 shrink-0 overflow-y-auto">
            <Sidebar/>
        </aside>
    </main>
</div>

<Toast/>

<LoadingOverlay/>
