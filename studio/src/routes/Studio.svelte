<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { Type, SwatchBook, PencilLine } from 'lucide-svelte'
    import { inviteKey } from '$lib/stores/auth'
    import { sidebarMode } from '$lib/stores/sidebarMode'
    import Layout from '$lib/components/studio/Layout.svelte'
    import Selector from '$lib/components/studio/preview/Selector.svelte'
    import Preview from '$lib/components/studio/preview/Preview.svelte'
    import EditorSidebar from '$lib/components/studio/sidebars/editor/Sidebar.svelte'
    import ChangesSidebar from '$lib/components/studio/sidebars/changes/Sidebar.svelte'
    import MomentsSidebar from '$lib/components/studio/sidebars/moments/Sidebar.svelte'
    import LidButton from '$lib/components/studio/sidebars/LidButton.svelte'

    let view: 'desktop'|'code' = 'desktop'

    onMount(() => {
        if (!$inviteKey) {
            replace('/')
        }
    })
</script>

<Layout>
    <!-- preview -->
    <div class="flex-1 min-h-0 bg-[#f0ede8] flex flex-col overflow-hidden">
        <Selector bind:view/>
        <Preview {view}/>
    </div>

    <!-- right sidebars -->
    <aside class="w-92 border-l border-[#0d0d0d]/6 shrink-0 flex flex-col relative">
        <!-- tab lids -->
        <div class="absolute right-full top-2 flex flex-col">
            <LidButton icon={SwatchBook} title="Your Moments" active={$sidebarMode === 'moments'} onclick={() => sidebarMode.set('moments')}/>
            <LidButton icon={Type} title="Editor" active={$sidebarMode === 'editor'} onclick={() => sidebarMode.set('editor')}/>
            <LidButton icon={PencilLine} title="Changes" active={$sidebarMode === 'changes'} onclick={() => sidebarMode.set('changes')}/>
        </div>

        <!-- active panel -->
        <div class="flex-1 min-h-0 flex flex-col">
            <div class="h-full flex flex-col" class:hidden={$sidebarMode !== 'moments'}>
                <MomentsSidebar/>
            </div>

            <div class="h-full flex flex-col" class:hidden={$sidebarMode !== 'editor'}>
                <EditorSidebar/>
            </div>

            <div class="h-full flex flex-col" class:hidden={$sidebarMode !== 'changes'}>
                <ChangesSidebar/>
            </div>
        </div>
    </aside>
</Layout>
