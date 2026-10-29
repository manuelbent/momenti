<script lang="ts">
    import { onMount } from 'svelte'
    import Router from 'svelte-spa-router'
    import { getMe } from '$lib/api'
    import { inviteKey } from '$lib/stores/auth'
    import { momentGeneration } from '$lib/stores/momentGeneration'
    import Landing from './routes/Landing.svelte'
    import Studio from './routes/Studio.svelte'
    import Preview from './routes/Preview.svelte'

    onMount(async () => {
        const key = localStorage.getItem('momenti__invite_key')
        if (!key) {
            return
        }

        // local auth
        inviteKey.set(key)

        const user = await getMe()
        if (!user.isGenerating) {
            return
        }

        await momentGeneration.resume()
    })
</script>

<Router routes={{
    '/': Landing,
    '/studio': Studio,
    '/preview': Preview
}}/>
