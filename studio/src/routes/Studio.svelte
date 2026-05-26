<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Navbar from '$lib/components/studio/components/Navbar.svelte'
    import FrameSelector from '$lib/components/studio/FrameSelector.svelte'
    import FrameView from '$lib/components/studio/FrameView.svelte'
    import Sidebar from '$lib/components/studio/sidebar/Sidebar.svelte'
    import Toast from '$lib/components/ui/Toast.svelte'
    import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte'

    let view: 'desktop'|'mobile'|'code' = 'desktop'

    onMount(() => {
        if (!$inviteKey) {
            replace('/')
        }
    })
</script>

<div class="h-screen text-[#0d0d0d] bg-[#f0ede8] flex flex-col overflow-hidden">

    <Navbar/>

    <main class="flex flex-1 min-h-0">

        <div class="flex-1 min-h-0 bg-[#f0ede8] flex flex-col overflow-hidden">
            <div class="mt-8 flex justify-center shrink-0">
                <FrameSelector bind:view/>
            </div>

            <FrameView {view}/>
        </div>

        <aside class="w-92 border-l border-[#0d0d0d]/6 shrink-0 overflow-y-auto">
            <Sidebar/>
        </aside>
    </main>
</div>

<Toast/>

<LoadingOverlay/>
