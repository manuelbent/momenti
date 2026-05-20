<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Navbar from '$lib/components/studio/components/Navbar.svelte'
    import ViewToggle from '$lib/components/studio/ViewToggle.svelte'
    import DeviceView from '$lib/components/studio/DeviceView.svelte'
    import Sidebar from '$lib/components/studio/sidebar/Sidebar.svelte'
    import ElementToolbar from '$lib/components/builder/ElementToolbar.svelte'
    import Toast from '$lib/components/ui/Toast.svelte'
    import LoadingOverlay from '$lib/components/ui/LoadingOverlay.svelte'

    let view: 'desktop'|'mobile' = 'desktop'

    onMount(() => {
        if (!$inviteKey) {
            replace('/')
        }
    })
</script>

<!-- landing layout -->
<div class="h-screen text-[#0d0d0d] bg-[#f0ede8] font-serif flex flex-col overflow-hidden">

    <Navbar/>

    <!-- content -->
    <main class="flex flex-1 min-h-0">

        <!-- preview -->
        <div class="flex-1 min-h-0 bg-[#f0ede8] flex flex-col overflow-hidden">
            <!-- toggle -->
            <div class="mt-8 flex justify-center shrink-0">
                <ViewToggle bind:view/>
            </div>

            <!-- device view -->
            <DeviceView {view}/>
        </div>

        <!-- right sidebar -->
        <aside class="w-92 border-l border-[#0d0d0d]/6 shrink-0 overflow-y-auto">
            <Sidebar/>
        </aside>
    </main>
</div>

<ElementToolbar/>

<Toast/>

<LoadingOverlay/>
