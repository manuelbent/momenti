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
        // Existing ones...
        'A wedding in Lake Como, July 23th, address to confirm, with soft floral aesthetics, light palette and RSVP section...',

        // The "Just the Facts" user
        'im starting a dog walking business in austin. need a page to show prices and a way to text me...',
        'landing page for an ebook im writing about remote work. just a big headline, a summary, and an email signup box...',
        'portfolio page for a freelance backend dev. very clean, links to github, dark mode, no fluff...',

        // The "I know what I want it to look like" user
        'A minimalist portfolio for an architect. Huge images, lots of white space, clean lines, muted gray colors...',
        'Retro 90s gaming aesthetic for a indie game launch. Pixel art fonts, bright neon green on black, very nostalgic...',
        'A landing page that looks like a high-end fashion magazine. Big bold serif fonts, cream background, elegant...',

        // The "SaaS Founder in a hurry" user
        'SaaS landing page for an AI social media scheduler. Hero section with a mockup, feature grid, testimonial cards, and a pricing table...',
        'Waitlist page for a new fintech app. Sleek, dark mode, glowing blue accents, and a giant "Join the Waitlist" input field...',
        'A clean B2B landing page for a cybersecurity consulting firm. Professional, trustworthy blue tones, logos of past clients...',

        // The "Local Business / Side Hustle" user
        'I need a page for my local ceramic studio. Want a cozy, earthy vibe, a gallery of my bowls, and a section for upcoming workshops...',
        'A simple one-page site for a personal trainer. Energetic vibe, client before/after photos, and a link to book a free intro call...',
        'Home cleaning service in chicago. Clean blue and white colors, list of services, and a big "Get a Free Quote" form right at the top...',

        // The "Conversational / Rambling" user
        'Can you make a cool landing page for a underground techno party in Berlin? Needs to feel dark, mysterious, with a countdown timer and ticket link...',
        'I want a website for my matcha brand. Super clean, soft green tones, peaceful vibe, showing off the ingredients and a "Shop Now" button...',
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
