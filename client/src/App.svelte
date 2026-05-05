<script lang="ts">
    import Router from 'svelte-spa-router'
    import { inviteKey } from '$lib/stores/auth'
    import Landing from './routes/Landing.svelte'
    import Studio from './routes/Studio.svelte'
    import Preview from './routes/Preview.svelte'

    // local auth
    const key = localStorage.getItem('momenti__invite_key')
    if (key) inviteKey.set(key)
</script>

<Router routes={{
    '/': Landing,
    '/studio': Studio,
    '/preview': Preview
}}/>
