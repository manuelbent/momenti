<script lang="ts">
    import ViewToggle from '../lib/components/studio/ViewToggle.svelte'

    let view: 'desktop'|'mobile' = 'desktop'
</script>

<!-- landing layout -->
<div class="min-h-screen text-[#0d0d0d] bg-[#f0ede8] font-serif flex flex-col">

    <!-- header -->
    <header class="flex items-center px-6 md:px-10 py-7 border-b border-[#0d0d0d]/6">
        <span class="text-[18px] font-normal tracking-[0.12em]">momenti</span>
    </header>

    <!-- content -->
    <main class="flex flex-1">

        <!-- preview -->
        <div class="flex-1 bg-[#f0ede8] flex flex-col items-center">

            <!-- toggle -->
            <div class="mt-6">
                <ViewToggle bind:view/>
            </div>

        </div>

        <!-- right sidebar -->
        <aside class="w-92 border-l border-[#0d0d0d]/6 h-full min-h-screen">
            sidebar
        </aside>

    </main>
</div>
