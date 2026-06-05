<script lang="ts">
    import { moment, hasForms } from '$lib/stores/moment'
    import SlugInput from './components/SlugInput.svelte'
    import SaveButton from './components/SaveButton.svelte'
    import PreviewButton from './components/PreviewButton.svelte'
    import ViewButton from './components/ViewButton.svelte'
    import PublishButton from './components/PublishButton.svelte'
    import UnpublishButton from './components/UnpublishButton.svelte'
    import PromptViewer from './components/PromptViewer.svelte'
    import DownloadFormSubmissionsButton from './components/DownloadFormSubmissionsButton.svelte'
</script>

<div class="flex flex-col h-full overflow-y-auto p-6 gap-6">

    <PromptViewer/>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <SlugInput/>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <div class="flex flex-col gap-3">
        <SaveButton/>

        {#if $moment?.is_published}
            <ViewButton/>
        {:else}
            <PreviewButton/>
        {/if}

        {#if $moment?.is_published}
            <UnpublishButton/>
        {:else}
            <PublishButton/>
        {/if}

        {#if $hasForms}
            <DownloadFormSubmissionsButton/>
        {/if}
    </div>

</div>
