<script lang="ts">
    export let view: 'desktop' | 'mobile' = 'desktop';
</script>

<div class="flex items-center gap-3">
    <button
        on:click={() => view = 'desktop'}
        class="cursor-pointer transition-opacity duration-150 {view === 'desktop' ? 'opacity-100' : 'opacity-25 hover:opacity-50'}"
        title="Desktop"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <path d="M8 21h8M12 17v4"/>
        </svg>
    </button>

    <!-- divider -->
    <span class="w-px h-3.5 bg-[#0d0d0d]/15"></span>

    <button
        on:click={() => view = 'mobile'}
        class="cursor-pointer transition-opacity duration-150 {view === 'mobile' ? 'opacity-100' : 'opacity-25 hover:opacity-50'}"
        title="Mobile"
    >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2"/>
            <path d="M12 18h.01"/>
        </svg>
    </button>
</div>

