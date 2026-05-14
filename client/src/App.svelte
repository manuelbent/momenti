<script lang="ts">
    import { onMount } from 'svelte'
    import Router from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Landing from './routes/Landing.svelte'
    import Studio from './routes/Studio.svelte'
    import Preview from './routes/Preview.svelte'
    import MomentView from './routes/MomentView.svelte'
    import { getMomentBySlug } from '$lib/api'

    let moment: Moment | null = null

    onMount(async () => {
        const [ slug ] = window.location.hostname.split('.')
        if (slug !== 'momenti') {
            moment = await getMomentBySlug(slug)
        }
    })

    // local auth
    const key = localStorage.getItem('momenti__invite_key')
    if (key) inviteKey.set(key)
</script>

{#if moment}
    <MomentView moment={moment}/>
{:else}
    <Router routes={{
        '/': Landing,
        '/studio': Studio,
        '/preview': Preview
    }}/>
{/if}
