<script lang="ts">
    import Renderer from '../../../../engine/Renderer.svelte'
    import BrowserChrome from './components/BrowserChrome.svelte'

    export let moment: Moment | undefined = undefined
</script>

<div class="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-[#0d0d0d]/8 border border-[#0d0d0d]/8">

    <BrowserChrome slug={moment?.slug ?? '<your-custom-slug>'} />

    <!-- content -->
    <div class="flex-1 min-h-0 bg-white overflow-y-auto">
        {#if moment}
            <Renderer node={moment.content.root} />
        {:else}
            <div class="flex items-center justify-center h-64 text-[#0d0d0d]/20 text-sm tracking-wide">
                no moment yet
            </div>
        {/if}
    </div>
</div>
