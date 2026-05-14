<script lang="ts">
    import { moment, moments, hasForms } from '$lib/stores/moment'
    import SlugInput from './components/SlugInput.svelte'
    import PromptCounter from './components/PromptCounter.svelte'
    import RecaptureButton from './components/RecaptureButton.svelte'
    import SaveButton from './components/SaveButton.svelte'
    import PreviewButton from './components/PreviewButton.svelte'
    import PublishButton from './components/PublishButton.svelte'
    import UnpublishButton from './components/UnpublishButton.svelte'
    import YourMoments from './components/YourMoments.svelte'
    import PromptViewer from './components/PromptViewer.svelte'
    import DownloadFormSubmissionsButton
        from '$lib/components/studio/sidebar/components/DownloadFormSubmissionsButton.svelte'
</script>

<div class="flex flex-col h-full overflow-y-auto p-6 gap-6 font-sans">

    <PromptCounter used={$moments.length}/>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <div class="flex flex-col gap-3">
        <SlugInput/>

        <PromptViewer/>
    </div>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <div class="flex flex-col gap-3">
        <RecaptureButton/>

        <SaveButton/>

        <PreviewButton/>

        {#if $moment?.is_published}
            <UnpublishButton/>
        {:else}
            <PublishButton/>
        {/if}

        {#if $hasForms}
            <DownloadFormSubmissionsButton/>
        {/if}
    </div>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <YourMoments/>
</div>
