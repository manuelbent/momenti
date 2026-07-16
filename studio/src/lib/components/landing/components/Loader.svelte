<script lang="ts">
    import { fade } from 'svelte/transition'

    const { streamText = '', phase = 'capture' }: { streamText?: string; phase?: 'art' | 'capture' } = $props()

    // progress ring
    const CIRCUMFERENCE = 2 * Math.PI * 50

    type PhaseConfig = { estimatedChars: number; labels: string[] }

    const PHASE_CONFIG: Record<'art' | 'capture', PhaseConfig> = {
        art: {
            estimatedChars: 1_200,
            labels: [
                'Imagining your moment...',
                'Setting the mood...',
                'Choosing a palette...',
                'Planning the motion...',
            ],
        },
        capture: {
            estimatedChars: 7_000,
            labels: [
                'Composing your moment...',
                'Defining the structure...',
                'Composing the layout...',
                'Adding visuals...',
                'Polishing the details...',
            ],
        },
    }

    const config = $derived(PHASE_CONFIG[phase])

    // Completion ratio of the current phase (0 → 1), driven purely by streamed length.
    const ratio = $derived(Math.min(1, streamText.length / config.estimatedChars))

    // The ring represents the whole generation as one continuous process:
    // the art phase fills 0 → ART_FRACTION, the capture phase fills ART_FRACTION → MAX.
    const ART_FRACTION = 0.18
    const MAX = 0.9

    const progress = $derived(
        phase === 'art' ?
            ratio * ART_FRACTION :
            ART_FRACTION + ratio * (MAX - ART_FRACTION)
    )
    const dashOffset = $derived(CIRCUMFERENCE * (1 - progress))

    // Labels advance by progress band, not by content sniffing — a JSON value that
    // happens to contain a key name can never jump the label forward.
    const status = $derived.by(() => {
        const idx = Math.min(config.labels.length - 1, Math.floor(ratio * config.labels.length))
        return config.labels[idx]
    })

    // Throttle: each label must be visible for at least MIN_DURATION ms.
    const MIN_DURATION = 1100
    let displayedStatus = $state('Imagining your moment...')
    let lastUpdate = 0
    let pendingTimer: ReturnType<typeof setTimeout>|undefined
    let prevPhase: 'art' | 'capture' = 'art'

    $effect(() => {
        const next = status

        // On phase change, switch label immediately (no throttle).
        if (phase !== prevPhase) {
            prevPhase = phase
            clearTimeout(pendingTimer)
            displayedStatus = next
            lastUpdate = Date.now()
            return
        }

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
    <div class="relative h-4 w-full">
        {#key displayedStatus}
            <p class="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[11px] tracking-widest text-ink"
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