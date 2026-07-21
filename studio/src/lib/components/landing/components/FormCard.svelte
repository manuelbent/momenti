<script lang="ts">
    import { ArrowUp } from 'lucide-svelte'
    import RoundButton from '$lib/components/ui/RoundButton.svelte'

    let {
        prompt = $bindable(''),
        error = '',
        onCapture,
    }: {
        prompt?: string
        error?: string
        onCapture: () => void
    } = $props()

    let textarea: HTMLTextAreaElement

    const placeholders: string[] = [
        // Weddings & formal celebrations
        'A wedding in Lake Como, July 23th, address to confirm, with soft floral aesthetics, light palette and RSVP section...',
        'An elegant 50th anniversary dinner at Villa Rosa, September 12th, gold and ivory tones, schedule of the evening and RSVP...',
        'A garden engagement party, cream and sage green, photo gallery, venue map and a kind note asking guests to confirm...',

        // Birthdays & personal parties
        'Surprise 30th birthday party in Brooklyn, August 9th at 8pm, bold and playful, neon colors, countdown and address...',
        'A 1st birthday party with a soft pastel bear theme, Sunday afternoon, cozy vibe, RSVP and directions to the house...',
        'A retro 90s themed birthday bash, bright neon on black, pixel fonts, playlist link, countdown to the night...',

        // Reunions & gatherings
        'Family reunion this summer at the lake house, warm rustic feel, weekend schedule, photo gallery and headcount form...',
        'A 10 year high school class reunion, September 20th, nostalgic and fun, venue map, ticket link and RSVP...',
        'A big Sunday family lunch to celebrate grandma, cozy and warm, address, time and a form to know who is coming...',

        // Cultural & public events
        'An underground techno night in Berlin, dark and mysterious, countdown timer, lineup and ticket link...',
        'A summer art exhibition opening, minimal and editorial, big images, date, gallery address and guest list form...',
        'A charity gala dinner for a local shelter, refined navy and gold, program of the evening, venue map and RSVP...',
        'An open-air acoustic concert in the park, warm golden hour vibe, set times, location map and free entry note...',
        'A neighborhood street food festival, vibrant and colorful, date, map, vendor lineup and a countdown to opening...',
    ]

    const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]

    $effect(() => {
        if (!textarea) {
            return
        }

        textarea.focus()
    })
</script>

<div class="grid grid-cols-1 border bg-white border-ink-accent rounded-2xl overflow-hidden shadow-xl">
    <textarea
            bind:this={textarea}
            class="w-full bg-white border-none outline-none resize-none px-5.5 py-5 text-[14px] leading-[1.7]
            text-ink placeholder-ink-accent caret-canvas font-serif"
            placeholder={placeholder}
            bind:value={prompt}
            rows={5}
            onkeydown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onCapture() }}></textarea>

    {#if error}
        <p class="text-xs text-error px-5.5 py-2">{error}</p>
    {/if}

    <div class="flex justify-end p-3 border-t border-ink-accent">
        <RoundButton onclick={onCapture} disabled={!prompt.trim()}>
            <ArrowUp size={12}/>
        </RoundButton>
    </div>
</div>
