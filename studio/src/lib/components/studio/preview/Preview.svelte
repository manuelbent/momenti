<script lang="ts">
    import DesktopView from '$lib/components/studio/preview/desktop/DesktopView.svelte'
    import CodeView from '$lib/components/studio/preview/code/CodeView.svelte'

    export let view: 'desktop'|'mobile'|'code' = 'desktop'

    const components: Record<string, any> = {
        desktop: DesktopView,
        code: CodeView
    }

    $: component = components[view]
</script>

<div class="flex flex-1 justify-center w-full min-h-0">
    <svelte:component this={component} />
</div>
