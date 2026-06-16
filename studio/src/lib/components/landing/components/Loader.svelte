<script lang="ts">
    import { fade } from 'svelte/transition'

    const { streamText = '' }: { streamText?: string } = $props()

    // progress ring
    const CIRCUMFERENCE = 2 * Math.PI * 50
    const ESTIMATED_CHARS = 7_000
    const progress = $derived(Math.min(0.9, streamText.length / ESTIMATED_CHARS))
    const dashOffset = $derived(CIRCUMFERENCE * (1 - progress))

    // messages
    const milestones: Array<{ test: (t: string) => boolean; label: string }> = [
        { test: () => true, label: 'Imagining your moment...' },
        { test: t => t.includes('"slug"'), label: 'Naming your moment...' },
        { test: t => t.includes('"root"'), label: 'Defining the structure...' },
        { test: t => t.includes('"children"'), label: 'Composing the layout...' },
        { test: t => (t.match(/"type":/g) ?? []).length > 3, label: 'Placing the elements...' },
        { test: t => (t.match(/"html":/g) ?? []).length > 1, label: 'Writing the content...' },
        { test: t => t.includes('"image"'), label: 'Adding visuals...' },
        { test: t => t.length > 5000, label: 'Polishing the details...' },
    ]

    function deriveStatus(text: string): string {
        let label = milestones[0].label
        for (const m of milestones) {
            if (m.test(text)) label = m.label
        }
        return label
    }

    // Throttle: each label must be visible for at least MIN_DURATION ms.
    const MIN_DURATION = 1100
    let displayedStatus = $state('Imagining your moment...')
    let lastUpdate = 0
    let pendingTimer: ReturnType<typeof setTimeout>|undefined

    $effect(() => {
        const next = deriveStatus(streamText)
        if (next === displayedStatus) return

        const elapsed = Date.now() - lastUpdate
        clearTimeout(pendingTimer)

        if (elapsed >= MIN_DURATION) {
            displayedStatus = next
            lastUpdate = Date.now()
        } else {
            pendingTimer = setTimeout(() => {
                displayedStatus = next
                lastUpdate = Date.now()
            }, MIN_DURATION - elapsed)
        }
    })
</script>

<div class="flex flex-col items-center gap-10" aria-live="polite" aria-label="Generating your moment">
    <!-- ring stack -->
    <div class="relative w-28 h-28">

        <!-- 1. dim base ring -->
        <svg class="absolute inset-0 w-full h-full " viewBox="0 0 112 112" fill="none">
            <circle cx="56" cy="56" r="50" stroke-width="0.75" stroke="#0d0d0d" opacity="0.07"/>
        </svg>

        <!-- 2. progress fill ring (rotated so it starts at the top) -->
        <svg class="absolute inset-0 w-full h-full -rotate-90 " viewBox="0 0 112 112" fill="none">
            <circle
                    cx="56" cy="56" r="50"
                    stroke-width="1"
                    stroke-linecap="round"
                    stroke="#0d0d0d"
                    opacity="0.35"
                    stroke-dasharray={CIRCUMFERENCE}
                    stroke-dashoffset={dashOffset}
                    style="transition: stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)"
            />
        </svg>

        <!-- 3. breathing centre dot -->
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="dot" style="background: #0d0d0d"></div>
        </div>
    </div>

    <!-- status label -->
    <div class="h-4 overflow-hidden">
        {#key displayedStatus}
            <p class="text-[11px] tracking-widest text-ink"
               in:fade={{ duration: 500, delay: 80 }}
               out:fade={{ duration: 250 }}
            >{displayedStatus}</p>
        {/key}
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