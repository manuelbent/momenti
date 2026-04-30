<script lang="ts">
    import SlugInput from './components/SlugInput.svelte'
    import PromptCounter from './components/PromptCounter.svelte'
</script>

<div class="flex flex-col h-full p-6 gap-6">

    <PromptCounter used={0} />

    <hr class="border-[#0d0d0d]/6 -mx-6" />

    <SlugInput/>


</div>


