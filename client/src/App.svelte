<script lang="ts">
    import Router from 'svelte-spa-router'
    import Landing from './routes/Landing.svelte'
    import Preview from './routes/Preview.svelte'
    import Studio from './routes/Studio.svelte'
</script>

<Router routes={{
    '/': Landing,
    '/preview': Preview,
    '/studio': Studio
}}/>
