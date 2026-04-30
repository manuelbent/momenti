<script lang="ts">
    import SlugInput from './components/SlugInput.svelte'
    import PromptCounter from './components/PromptCounter.svelte'
    import RegenerateButton from './components/RegenerateButton.svelte'
    import PublishButton from './components/PublishButton.svelte'
    import YourMoments from './components/YourMoments.svelte'
</script>

<div class="flex flex-col h-full p-6 gap-6 font-sans">

    <PromptCounter used={0} />

    <hr class="border-[#0d0d0d]/6 -mx-6" />

    <div class="flex flex-col gap-3">
        <SlugInput/>
    </div>

    <hr class="border-[#0d0d0d]/6 -mx-6" />

    <div class="flex flex-col gap-3">
        <RegenerateButton />

        <PublishButton />
    </div>

    <hr class="border-[#0d0d0d]/6 -mx-6" />

    <!-- your moments -->
    <YourMoments moments={[]} />
</div>


