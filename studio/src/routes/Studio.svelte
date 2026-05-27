<script lang="ts">
    import { onMount } from 'svelte'
    import { replace } from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Layout from '$lib/components/studio/Layout.svelte'
    import FrameSelector from '$lib/components/studio/frames/FrameSelector.svelte'
    import FrameView from '$lib/components/studio/frames/FrameView.svelte'
    import Sidebar from '$lib/components/studio/sidebar/Sidebar.svelte'
    import ElementToolbar from '$lib/components/builder/ElementToolbar.svelte'

    let view: 'desktop'|'mobile'|'code' = 'desktop'

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
        <div class="mt-8 flex justify-center shrink-0">
            <FrameSelector bind:view/>
        </div>

        <FrameView {view}/>
    </div>

    <!-- right sidebar -->
    <aside class="w-92 border-l border-[#0d0d0d]/6 shrink-0 overflow-y-auto">
        <Sidebar/>
    </aside>

</Layout>

<ElementToolbar/>
