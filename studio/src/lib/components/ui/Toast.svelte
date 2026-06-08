<script lang="ts">
    import { fly } from 'svelte/transition'
    import { toast } from '$lib/stores/toast'
    import { Check, X, Info } from 'lucide-svelte'

    const colorClasses = {
        success: 'bg-[#e8f5ee] text-[#1a6638] border border-[#b6dfc7]',
        error: 'bg-red-50 text-red-700 border border-red-200',
        info: 'bg-[#f1ede9] text-[#959391] border border-[#dfdbd7]'
    }

    const icons = {
        success: Check,
        error: X,
        info: Info
    }
</script>

{#if $toast}
    {@const Icon = icons[$toast.type]}
    <div
        role="status"
        aria-live="polite"
        in:fly={{ x: 48, duration: 600, opacity: 0 }}
        out:fly={{ x: 48, duration: 600, opacity: 0 }}
        class="fixed bottom-6 right-6 z-9999 flex items-center gap-2.5 px-4 py-2 rounded-xl shadow-lg text-[12px] tracking-[0.04em] pointer-events-none
        {colorClasses[$toast.type]}">
        <Icon size={12} strokeWidth={2.5} />
        {$toast.message}
    </div>
{/if}
