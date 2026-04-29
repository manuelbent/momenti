<script lang="ts">
    import { fade } from 'svelte/transition'

    const { streamText = '' }: { streamText?: string } = $props()

    const status = $derived(deriveStatus(streamText))

    function deriveStatus(text: string): string {
        if (!text)                              return 'Thinking…'
        const nodes = (text.match(/"type":/g) ?? []).length
        if (text.includes('"form"'))            return 'Adding interactive elements…'
        if (text.includes('"image"'))           return 'Placing visuals…'
        if (nodes > 6)                          return `Composing element ${nodes}…`
        if (text.includes('"children"'))        return 'Building the layout…'
        if (text.includes('"css"'))             return 'Styling your moment…'
        if (text.includes('"root"'))            return 'Structuring the page…'
        if (text.includes('"slug"'))            return 'Shaping your moment…'
        return 'Thinking…'
    }
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

    <!-- status -->
    <div class="h-4 overflow-hidden">
        {#key status}
            <p
                class="font-sans text-[11px] tracking-[0.26em] uppercase text-[#555]"
                in:fade={{ duration: 400 }}
                out:fade={{ duration: 200 }}
            >{status}</p>
        {/key}
    </div>
</div>
