<script lang="ts">
    import Router from 'svelte-spa-router'
    import Landing from './routes/Landing.svelte'
    import Preview from './routes/Preview.svelte'
</script>

<Router routes={{
    '/': Landing,
    '/preview': Preview
}}/>
