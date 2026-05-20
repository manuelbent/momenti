<script lang="ts">
    let {
        prompt = $bindable(''),
        error = '',
        onCapture,
    }: {
        prompt?: string
        error?: string
        onCapture: () => void
    } = $props()

    const placeholders: string[] = [
        // Existing ones...
        'A wedding in Lake Como, July 23th, address to confirm, with soft floral aesthetics, light palette and RSVP section.',

        // The "Just the Facts" user
        'im starting a dog walking business in austin. need a page to show prices and a way to text me.',
        'landing page for an ebook im writing about remote work. just a big headline, a summary, and an email signup box.',
        'portfolio page for a freelance backend dev. very clean, links to github, dark mode, no fluff.',

        // The "I know what I want it to look like" user
        'A minimalist portfolio for an architect. Huge images, lots of white space, clean lines, muted gray colors.',
        'Retro 90s gaming aesthetic for a indie game launch. Pixel art fonts, bright neon green on black, very nostalgic.',
        'A landing page that looks like a high-end fashion magazine. Big bold serif fonts, cream background, elegant.',

        // The "SaaS Founder in a hurry" user
        'SaaS landing page for an AI social media scheduler. Hero section with a mockup, feature grid, testimonial cards, and a pricing table.',
        'Waitlist page for a new fintech app. Sleek, dark mode, glowing blue accents, and a giant "Join the Waitlist" input field.',
        'A clean B2B landing page for a cybersecurity consulting firm. Professional, trustworthy blue tones, logos of past clients.',

        // The "Local Business / Side Hustle" user
        'I need a page for my local ceramic studio. Want a cozy, earthy vibe, a gallery of my bowls, and a section for upcoming workshops.',
        'A simple one-page site for a personal trainer. Energetic vibe, client before/after photos, and a link to book a free intro call.',
        'Home cleaning service in chicago. Clean blue and white colors, list of services, and a big "Get a Free Quote" form right at the top.',

        // The "Conversational / Rambling" user
        'Can you make a cool landing page for a underground techno party in Berlin? Needs to feel dark, mysterious, with a countdown timer and ticket link.',
        'I want a website for my matcha brand. Super clean, soft green tones, peaceful vibe, showing off the ingredients and a "Shop Now" button.',
    ]

    const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)]
</script>

<div class="bg-white/3 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
    <textarea
            class="w-full bg-transparent border-none outline-none resize-none px-5.5 py-5 font-serif text-[17px] leading-[1.7] text-[#f0ede8] caret-[#f0ede8] placeholder-[#3a3a3a]"
            placeholder={placeholder}
            bind:value={prompt}
            rows={4}
            onkeydown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onCapture() }}
    ></textarea>

    {#if error}
        <p class="font-sans text-xs text-[#e07070] px-5.5 py-2">{error}</p>
    {/if}

    <div class="flex items-center justify-between py-2.5 pl-5.5 pr-3.5 border-t border-white/6">
        <span class="font-sans text-[11px] text-[#3a3a3a] tracking-[0.04em]">⌘↵ to capture</span>
        <button
                class="flex items-center gap-2 bg-[#f0ede8] text-[#0d0d0d] rounded-[10px] py-3 px-5.5 font-sans text-[13px] font-semibold tracking-[0.04em] transition-[opacity,transform] duration-150 disabled:opacity-[0.22] disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.97]"
                onclick={onCapture}
                disabled={!prompt.trim()}
        >Capture
        </button>
    </div>
</div>
