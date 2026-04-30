<script lang="ts">
    import SlugInput from './components/SlugInput.svelte'
    import PromptCounter from './components/PromptCounter.svelte'
    import RegenerateButton from './components/RegenerateButton.svelte'
    import PublishButton from './components/PublishButton.svelte'
</script>

<div class="flex flex-col h-full p-6 gap-6 font-sans">

    <PromptCounter used={0} />

    <hr class="border-[#0d0d0d]/6 -mx-6" />

    <SlugInput/>

    <hr class="border-[#0d0d0d]/6 -mx-6" />

    <RegenerateButton />

    <PublishButton />

</div>


