<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import ViewToggle from '$lib/components/studio/ViewToggle.svelte'
    import DeviceView from '$lib/components/studio/DeviceView.svelte'
    import Sidebar from '$lib/components/studio/sidebar/Sidebar.svelte'
    import Toast from '$lib/components/ui/Toast.svelte'
    import TextToolbar from '$lib/components/builder/TextToolbar.svelte'

    let view: 'desktop'|'mobile' = 'desktop'

    onMount(() => {
        if (!$inviteKey) {
            replace('/')
        }
    })
</script>

<!-- landing layout -->
<div class="h-screen text-[#0d0d0d] bg-[#f0ede8] font-serif flex flex-col overflow-hidden">

    <!-- header -->
    <header class="flex items-center px-6 md:px-10 py-7 border-b border-[#0d0d0d]/6">
        <a href="/">
            <span class="text-[18px] font-normal tracking-[0.12em]">momenti</span>
        </a>
    </header>

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

<TextToolbar/>

<Toast/>
