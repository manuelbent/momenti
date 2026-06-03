<script lang="ts">
    import { fade } from 'svelte/transition'

    let { streamText }: { streamText: string } = $props()

    const ringColor = '#0d0d0d'
    const dotColor = '#0d0d0d'

    // r=50 → circumference ≈ 314. We cap visible fill at 90% so it never looks "done"
    // before the route transition fires.
    const CIRCUMFERENCE = 2 * Math.PI * 50
    const ESTIMATED_CHARS = 7_000
    const progress = $derived(Math.min(0.9, streamText.length / ESTIMATED_CHARS))
    const dashOffset = $derived(CIRCUMFERENCE * (1 - progress))
</script>

<div
        class="fixed inset-0 flex items-center justify-center bg-[#f0ede8]/50 backdrop-blur-sm pointer-events-auto select-none z-50"
        transition:fade={{ duration: 300 }}
        aria-live="polite"
        aria-label="Changes in progress..."
>
    <div class="flex flex-col items-center" aria-live="polite" aria-label="AI is generating your page">
        <!-- ring stack -->
        <div class="relative w-28 h-28">

            <!-- 1. dim base ring -->
            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 112 112" fill="none">
                <circle cx="56" cy="56" r="50" stroke={ringColor} stroke-width="0.75" opacity="0.07"/>
            </svg>

            <!-- 2. progress fill ring (rotated so it starts at the top) -->
            <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 112 112" fill="none">
                <circle
                        cx="56" cy="56" r="50"
                        stroke={ringColor}
                        stroke-width="1"
                        stroke-linecap="round"
                        opacity="0.35"
                        stroke-dasharray={CIRCUMFERENCE}
                        stroke-dashoffset={dashOffset}
                        style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)"
                />
            </svg>

            <!-- 3. breathing centre dot -->
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="dot" style="background: {dotColor}"></div>
            </div>
        </div>

    </div>
</div>

<style>
    .dot {
        width: 5px;
        height: 5px;
        border-radius: 999px;
        background: #f0ede8;
        animation: breathe 2.6s ease-in-out infinite;
    }

    @keyframes breathe {
        0%, 100% {
            transform: scale(0.75);
            opacity: 0.5;
        }
        50% {
            transform: scale(1.5);
            opacity: 1;
        }
    }
</style>