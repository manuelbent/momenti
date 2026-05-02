<script lang="ts">
    import Router from 'svelte-spa-router'
    import Landing from './routes/Landing.svelte'
    import Studio from './routes/Studio.svelte'
    import Preview from './routes/Preview.svelte'
</script>

<Router routes={{
    '/': Landing,
    '/studio': Studio,
    '/preview': Preview
}}/>
