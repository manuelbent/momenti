<script lang="ts">
    import { fly } from 'svelte/transition'
    import { toast } from '$lib/stores/toast'
</script>

{#if $toast}
    <div
        role="status"
        aria-live="polite"
        in:fly={{ x: 48, duration: 600, opacity: 0 }}
        out:fly={{ x: 48, duration: 600, opacity: 0 }}
        class="fixed bottom-6 right-6 z-9999 flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg text-[12px] tracking-[0.04em] pointer-events-none
        {$toast.type === 'success'
            ? 'bg-[#e8f5ee] text-[#1a6638] border border-[#b6dfc7]'
            : 'bg-red-50 text-red-700 border border-red-200'}"
    >
        {#if $toast.type === 'success'}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        {/if}
        {$toast.message}
    </div>
{/if}
