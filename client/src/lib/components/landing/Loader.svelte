<script lang="ts">
    const { streamText = '' }: { streamText?: string } = $props()

    const MAX = 180
    const visibleText = $derived(
        streamText.length > MAX ? '…' + streamText.slice(-MAX) : streamText
    )
</script>

<div
    class="flex flex-col items-center gap-12"
    aria-live="polite"
    aria-label="AI is generating your page"
>
    <!-- orbital ring -->
    <div class="relative w-28 h-28">
        <svg class="absolute inset-0 w-full h-full" viewBox="0 0 112 112" fill="none" aria-hidden="true">
            <circle cx="56" cy="56" r="52" stroke="#f0ede8" stroke-width="0.75" opacity="0.08"/>
        </svg>
        <svg class="absolute inset-0 w-full h-full animate-orbit" viewBox="0 0 112 112" fill="none" aria-hidden="true">
            <circle cx="56" cy="56" r="52" stroke="#f0ede8" stroke-width="1"
                    stroke-dasharray="52 275" stroke-linecap="round" opacity="0.7"/>
        </svg>
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-1.25 h-1.25 rounded-full bg-[#f0ede8] animate-breathe"></div>
        </div>
    </div>

    <!-- stream text -->
    <pre class="w-80 h-16 overflow-hidden font-mono text-[10px] leading-[1.6] text-[#444] whitespace-pre-wrap break-all text-left">{visibleText}<span class="animate-pulse">▌</span></pre>
</div>
