<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Layout from '$lib/components/studio/Layout.svelte'
    import Selector from '$lib/components/studio/preview/Selector.svelte'
    import Preview from '$lib/components/studio/preview/Preview.svelte'
    import Sidebar from '$lib/components/studio/sidebar/Sidebar.svelte'
    import PromptSidebar from '$lib/components/studio/sidebar/PromptSidebar.svelte'
    import SidebarLidButton from '$lib/components/studio/sidebar/SidebarLidButton.svelte'
    import ElementToolbar from '$lib/components/builder/ElementToolbar.svelte'
    import { Pencil, Settings } from 'lucide-svelte'

    let view: 'desktop'|'code' = 'desktop'
    let activeTab: 'settings'|'changes' = 'settings'

    onMount(() => {
        if (!$inviteKey) {
            replace('/')
        }
    })
</script>

<!-- studio -->
<Layout>

    <!-- preview -->
    <div class="flex-1 min-h-0 bg-[#f0ede8] flex flex-col overflow-hidden">
        <Selector bind:view/>
        <Preview {view}/>
    </div>

    <!-- right sidebar -->
    <aside class="w-92 border-l border-[#0d0d0d]/6 shrink-0 flex flex-col relative">

        <!-- tab lids – stick out to the left -->
        <div class="absolute right-full top-2 flex flex-col">
            <SidebarLidButton icon={Settings} title="Settings" active={activeTab === 'settings'} onclick={() => activeTab = 'settings'}/>
            <SidebarLidButton icon={Pencil} title="Changes" active={activeTab === 'changes'} onclick={() => activeTab = 'changes'}/>
        </div>

        <!-- active panel -->
        <div class="flex-1 min-h-0 overflow-y-auto">
            <div class:hidden={activeTab !== 'settings'}>
                <Sidebar/>
            </div>

            <div class:hidden={activeTab !== 'changes'}>
                <PromptSidebar/>
            </div>
        </div>

    </aside>

</Layout>

<ElementToolbar/>
