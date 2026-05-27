<script lang="ts">
    import { onMount, onDestroy, getContext } from 'svelte'
    import { selectNode, selectedNode } from '$lib/stores/momentContent'

    export let node: MomentNode

    const viewOnly = getContext<boolean>('viewOnly') ?? false
    $: isSelected = !viewOnly && $selectedNode?.id === node.id

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

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<div
    class="flex items-center justify-center gap-1 [font-variant-numeric:tabular-nums]"
    class:momenti-selected={isSelected}
    id={node.id}
    data-nid={node.id}
    style={node.css ?? ''}
    onclick={() => !viewOnly && selectNode({ id: node.id, type: 'countdown', deleteId: node.id })}
>
    {#if timeLeft.expired}
        <span class="opacity-40 text-2xl">—</span>
    {:else}
        {#each [
            { value: timeLeft.days,    label: 'DAYS' },
            { value: timeLeft.hours,   label: 'HRS' },
            { value: timeLeft.minutes, label: 'MIN' },
            { value: timeLeft.seconds, label: 'SEC' },
        ] as unit}
            <div class="flex flex-col items-center min-w-[2.5em]">
                <span class="text-[clamp(2rem,6cqw,4rem)] font-bold leading-none tracking-wide">{pad(unit.value)}</span>
                <span class="text-[clamp(0.55rem,1.2cqw,0.75rem)] tracking-widest opacity-60 mt-1">{unit.label}</span>
            </div>
            {#if unit.label !== 'SEC'}
                <span class="text-[clamp(2rem,6cqw,4rem)] font-light leading-none self-start pt-[0.05em] opacity-50">:</span>
            {/if}
        {/each}
    {/if}
</div>

