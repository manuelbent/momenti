<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Layout from '$lib/components/studio/Layout.svelte'
    import Selector from '$lib/components/studio/preview/Selector.svelte'
    import Preview from '$lib/components/studio/preview/Preview.svelte'
    import SettingsSidebar from '$lib/components/studio/sidebars/settings/Sidebar.svelte'
    import ChangesSidebar from '$lib/components/studio/sidebars/changes/Sidebar.svelte'
    import MomentsSidebar from '$lib/components/studio/sidebars/moments/Sidebar.svelte'
    import LidButton from '$lib/components/studio/sidebars/LidButton.svelte'
    import { sidebarMode } from '$lib/stores/sidebarMode'
    import { Pencil, Settings, Library } from 'lucide-svelte'

    let view: 'desktop'|'code' = 'desktop'

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

        <!-- tab lids -->
        <div class="absolute right-full top-2 flex flex-col">
            <LidButton icon={Settings} title="Settings" active={$sidebarMode === 'settings'} onclick={() => sidebarMode.set('settings')}/>
            <LidButton icon={Pencil} title="Changes" active={$sidebarMode === 'changes'} onclick={() => sidebarMode.set('changes')}/>
            <LidButton icon={Library} title="Your Moments" active={$sidebarMode === 'moments'} onclick={() => sidebarMode.set('moments')}/>
        </div>

        <!-- active panel -->
        <div class="flex-1 min-h-0 flex flex-col">
            <div class="h-full flex flex-col" class:hidden={$sidebarMode !== 'settings'}>
                <SettingsSidebar/>
            </div>

            <div class="h-full flex flex-col" class:hidden={$sidebarMode !== 'changes'}>
                <ChangesSidebar/>
            </div>

            <div class="h-full flex flex-col" class:hidden={$sidebarMode !== 'moments'}>
                <MomentsSidebar/>
            </div>
        </div>

    </aside>

</Layout>

