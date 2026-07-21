<script lang="ts">
    let { node }: { node: MomentNode } = $props()

    interface TimeLeft {
        days: number;
        hours: number;
        minutes: number;
        seconds: number;
        expired: boolean
    }

    function calculate(targetDate: string | undefined, now: number): TimeLeft {
        const diff = new Date(targetDate ?? '').getTime() - now
        if (!targetDate || diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
        const totalSeconds = Math.floor(diff / 1000)
        return {
            days: Math.floor(totalSeconds / 86400),
            hours: Math.floor((totalSeconds % 86400) / 3600),
            minutes: Math.floor((totalSeconds % 3600) / 60),
            seconds: totalSeconds % 60,
            expired: false,
        }
    }

    let now = $state(Date.now())
    let timeLeft = $derived(calculate(node.targetDate, now))

    // (Re)start the ticker whenever the target date changes — e.g. when applying
    // or undoing a change swaps the node content. Stops once the target passes.
    $effect(() => {
        node.targetDate
        now = Date.now()
        if (calculate(node.targetDate, now).expired) return

        const timer = setInterval(() => {
            now = Date.now()
            if (calculate(node.targetDate, now).expired) clearInterval(timer)
        }, 1000)

        return () => clearInterval(timer)
    })

    function pad(n: number): string { return String(n).padStart(2, '0') }
</script>

<div class="flex items-center justify-center gap-1 [font-variant-numeric:tabular-nums]" id={node.id} data-nid={node.id} style={node.css ?? ''}>
    {#if timeLeft.expired}
        <span class="text-[clamp(2rem,6cqw,4rem)] font-bold leading-none tracking-wide">00:00:00:00</span>
    {:else}
        {#each [
            { value: timeLeft.days,    label: 'days' },
            { value: timeLeft.hours,   label: 'hrs' },
            { value: timeLeft.minutes, label: 'min' },
            { value: timeLeft.seconds, label: 'sec' },
        ] as unit}
            <div class="flex flex-col items-center min-w-[2.5em]">
                <span class="text-[clamp(2rem,6cqw,4rem)] font-bold leading-none tracking-wide">{pad(unit.value)}</span>
            </div>
            {#if unit.label !== 'sec'}
                <span class="text-[clamp(2rem,6cqw,4rem)] font-light leading-none self-start pt-[0.05em] opacity-50">:</span>
            {/if}
        {/each}
    {/if}
</div>
