<script lang="ts">
    import { moment as activeStore } from '$lib/stores/moment'

    export let moment: Moment

    $: isActive = $activeStore?.id === moment.id
</script>

<button onclick={() => activeStore.set(moment)}
        class="group w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors duration-150 cursor-pointer
        {isActive ? 'bg-[#0d0d0d]/6' : 'hover:bg-[#0d0d0d]/4'}"
>
    <!-- dot -->
    <span class="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-150
        {isActive ? 'bg-[#0d0d0d]/50' : 'bg-[#0d0d0d]/15 group-hover:bg-[#0d0d0d]/30'}">
    </span>
    <span class="text-[12px] text-[#0d0d0d]/60 truncate group-hover:text-[#0d0d0d]/80 transition-colors duration-150
        {isActive ? 'text-[#0d0d0d]' : ''}">
        {moment.slug}
    </span>
</button>
