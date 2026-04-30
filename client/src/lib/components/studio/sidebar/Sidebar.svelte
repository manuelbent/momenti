<script lang="ts">
    import SlugInput from './components/SlugInput.svelte'
    import PromptCounter from './components/PromptCounter.svelte'
    import RegenerateButton from './components/RegenerateButton.svelte'
    import SaveButton from './components/SaveButton.svelte'
    import PublishButton from './components/PublishButton.svelte'
    import YourMoments from './components/YourMoments.svelte'
    import PromptViewer from './components/PromptViewer.svelte'

    export let moment: Moment|undefined = undefined
</script>

<div class="flex flex-col h-full p-6 gap-6 font-sans">

    <PromptCounter used={0}/>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <div class="flex flex-col gap-3">
        <SlugInput slug={moment?.slug}/>

        <PromptViewer prompt={moment?.prompt}/>
    </div>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <div class="flex flex-col gap-3">
        <RegenerateButton/>

        <SaveButton/>

        <PublishButton/>
    </div>

    <hr class="border-[#0d0d0d]/6 -mx-6"/>

    <!-- your moments -->
    <YourMoments/>
</div>
