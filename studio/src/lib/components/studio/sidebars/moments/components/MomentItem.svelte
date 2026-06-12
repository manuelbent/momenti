<script lang="ts">
    import { moment as activeStore } from '$lib/stores/moment'
    import { selectedSection } from '$lib/stores/section'

    export let moment: Moment

    $: isActive = $activeStore?.id === moment.id

    const onclick = () => {
        activeStore.set(moment)
        selectedSection.set(null)
    }
</script>

<button {onclick}
        class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors duration-150 cursor-pointer
        {isActive ? 'bg-ink/6' : 'hover:bg-ink/4'}"
>
    <!-- dot -->
    <span class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-150
        {isActive ? 'bg-ink/50' : 'bg-ink/15 group-hover:bg-ink/30'}">
    </span>
    <span class="text-[12px] text-ink/60 truncate group-hover:text-ink/80 transition-colors duration-150
        {isActive ? 'text-ink' : ''}">
        {moment.slug}
    </span>
</button>
