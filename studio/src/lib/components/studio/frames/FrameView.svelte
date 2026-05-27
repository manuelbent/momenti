<script lang="ts">
    import DesktopFrame from '$lib/components/studio/frames/desktop/DesktopFrame.svelte'
    import CodeFrame from '$lib/components/studio/frames/code/CodeFrame.svelte'

    export let view: 'desktop'|'mobile'|'code' = 'desktop'

    const components: Record<string, any> = {
        desktop: DesktopFrame,
        code: CodeFrame
    }

    $: component = components[view]
</script>

<div class="flex flex-1 justify-center w-full min-h-0 p-8">
    <svelte:component this={component} />
</div>
