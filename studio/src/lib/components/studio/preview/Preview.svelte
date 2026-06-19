<script lang="ts">
    import DesktopView from '$lib/components/studio/preview/desktop/DesktopView.svelte'
    import CodeView from '$lib/components/studio/preview/code/CodeView.svelte'
    import MobileView from '$lib/components/studio/preview/mobile/MobileView.svelte'

    export let view: 'desktop'|'mobile'|'code' = 'desktop'

    const components: Record<string, any> = {
        desktop: DesktopView,
        mobile: MobileView,
        code: CodeView
    }

    $: component = components[view]
</script>

<div class="flex justify-center align-middle w-full h-full min-h-0">
    <svelte:component this={component} />
</div>
