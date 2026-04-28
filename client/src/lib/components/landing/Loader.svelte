<script lang="ts">
    import { fade } from 'svelte/transition'
    import { onMount, onDestroy } from 'svelte'

    const phrases = [
        'Crafting your moment…',
        'Weaving the palette…',
        'Composing the layout…',
        'Bringing it to life…',
    ]
    let phraseIndex = $state(0)
    let phraseTimer: ReturnType<typeof setInterval> | undefined

    onMount(() => {
        phraseTimer = setInterval(() => {
            phraseIndex = (phraseIndex + 1) % phrases.length
        }, 2600)
    })

    onDestroy(() => {
        clearInterval(phraseTimer)
    })
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

    <!-- cycling phrase -->
    <div class="h-4 overflow-hidden">
        {#key phraseIndex}
            <p
                class="font-sans text-[11px] tracking-[0.26em] uppercase text-[#555]"
                in:fade={{ duration: 500 }}
                out:fade={{ duration: 300 }}
            >{phrases[phraseIndex]}</p>
        {/key}
    </div>
</div>

