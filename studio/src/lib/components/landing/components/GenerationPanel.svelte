<script lang="ts">
    import { fade } from 'svelte/transition'
    import type { GenerationStage } from '$lib/stores/momentGeneration'
    import FormCard from './FormCard.svelte'
    import StreamingPreview from './StreamingPreview.svelte'

    let {
        prompt = $bindable(''),
        stage,
        progressStage,
        streamText,
        onCapture,
    }: {
        prompt?: string
        stage: GenerationStage
        progressStage?: CaptureProgressStage
        streamText: string
        onCapture: () => void
    } = $props()

</script>

{#snippet emptyStage()}
    <!-- -->
{/snippet}

{#snippet previewStage()}
    <div class="[grid-area:1/1] flex h-full w-full min-w-0 items-center justify-center pt-2"
         in:fade={{ delay: 600, duration: 450 }}
    >
        <StreamingPreview {streamText} {progressStage}/>
    </div>
{/snippet}

{#snippet formStage()}
    <div class="[grid-area:1/1] h-full"
         in:fade={{ duration: 450 }}
         out:fade={{ duration: 450 }}
    >
        <FormCard bind:prompt {onCapture}/>
    </div>
{/snippet}

{#snippet activeStage()}
    {@const renderers = {
        empty: emptyStage,
        preview: previewStage,
        form: formStage,
    }}
    {@render renderers[stage]()}
{/snippet}

<div class="grid w-full min-w-0 transition-[height] duration-700 ease-out"
     class:h-57.5={stage === 'form' || stage === 'empty'}
     class:h-[clamp(18rem,42vh,27rem)]={stage === 'preview'}
>
    {@render activeStage()}
</div>
