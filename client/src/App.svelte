<script lang="ts">
    import Router from 'svelte-spa-router'
    import Landing from './routes/Landing.svelte'
    import Studio from './routes/Studio.svelte'
    import Preview from './routes/Preview.svelte'
    import Toast from './lib/components/ui/Toast.svelte'
</script>

<Router routes={{
    '/': Landing,
    '/studio': Studio,
    '/preview': Preview
}}/>

<Toast/>
