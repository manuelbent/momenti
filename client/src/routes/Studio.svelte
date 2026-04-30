<script lang="ts">
    import { moment } from '../lib/stores/moment'
    import ViewToggle from '../lib/components/studio/ViewToggle.svelte'
    import DeviceView from '../lib/components/studio/DeviceView.svelte'
    import Sidebar from '../lib/components/studio/sidebar/Sidebar.svelte'

    let view: 'desktop'|'mobile' = 'desktop'
</script>

<!-- landing layout -->
<div class="h-screen text-[#0d0d0d] bg-[#f0ede8] font-serif flex flex-col overflow-hidden">

    <!-- header -->
    <header class="flex items-center px-6 md:px-10 py-7 border-b border-[#0d0d0d]/6">
        <span class="text-[18px] font-normal tracking-[0.12em]">momenti</span>
    </header>

    <!-- content -->
    <main class="flex flex-1 min-h-0">

        <!-- preview -->
        <div class="flex-1 min-h-0 bg-[#f0ede8] flex flex-col overflow-hidden">
            <!-- toggle -->
            <div class="mt-6 flex justify-center shrink-0">
                <ViewToggle bind:view/>
            </div>

            <!-- device view -->
            <DeviceView {view} moment={$moment}/>
        </div>

        <!-- right sidebar -->
        <aside class="w-92 border-l border-[#0d0d0d]/6 shrink-0 overflow-y-auto">
            <Sidebar moment={$moment} />
        </aside>
    </main>
</div>
