<script lang="ts">
    import { onMount } from 'svelte'
    import { loadFonts } from '$shared/loadFonts'
    import { getMomentBySlug } from '$lib/api/moments'
    import Renderer from '$lib/engine/Renderer.svelte'
    import NotFound from '$lib/components/NotFound.svelte'

    let moment: Moment|null = null
    let loading = true

    onMount(async () => {
        const [slug] = window.location.hostname.split('.')
        moment = await getMomentBySlug(slug)
        document.title = moment?.content.slug || document.title
        loadFonts(moment?.content.fonts)
        loading = false
    })
</script>

{#if loading}
    <!--  -->
{:else if moment}
    <div data-moment-viewport style="container-type: inline-size;">
        <Renderer node={moment.content.root}/>
    </div>
{:else}
    <NotFound/>
{/if}
