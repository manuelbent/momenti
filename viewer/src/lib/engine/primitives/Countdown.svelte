<script lang="ts">
    import { onMount, onDestroy } from 'svelte'

    export let node: MomentNode

    interface TimeLeft {
        days: number
        hours: number
        minutes: number
        seconds: number
        expired: boolean
    }

    function calculate(): TimeLeft {
        const diff = new Date(node.targetDate ?? '').getTime() - Date.now()
        if (!node.targetDate || diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
        }
        const totalSeconds = Math.floor(diff / 1000)
        return {
            days:    Math.floor(totalSeconds / 86400),
            hours:   Math.floor((totalSeconds % 86400) / 3600),
            minutes: Math.floor((totalSeconds % 3600) / 60),
            seconds: totalSeconds % 60,
            expired: false,
        }
    }

    let timeLeft: TimeLeft = calculate()
    let timer: ReturnType<typeof setInterval>

    onMount(() => {
        timer = setInterval(() => {
            timeLeft = calculate()
            if (timeLeft.expired) clearInterval(timer)
        }, 1000)
    })

    onDestroy(() => clearInterval(timer))

    function pad(n: number): string {
        return String(n).padStart(2, '0')
    }
</script>

<div class="flex items-center justify-center gap-1 [font-variant-numeric:tabular-nums]" style={node.css ?? ''} id={node.id} data-nid={node.id}>
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
