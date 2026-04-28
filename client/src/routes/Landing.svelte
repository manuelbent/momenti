<script lang="ts">
    import { push } from 'svelte-spa-router'
    import { generatedMoment, moment2 } from '../lib/stores/moment'
    import TypeWriter from '../lib/components/landing/TypeWriter.svelte'
    import Loader from '../lib/components/landing/Loader.svelte'

    let prompt = $state('')
    let isGenerating = $state(false)
    let error = $state('')

    async function generateEvent() {
        if (!prompt.trim()) return
        isGenerating = true
        error = ''

        const payload = JSON.stringify({
            user: `<PROMPT>${JSON.stringify(prompt.trim())}</PROMPT>`,
        })

        console.log('Sending payload', payload)

        try {
            await new Promise(r => setTimeout(r, 10 * 1000))
            generatedMoment.set($moment2)
            push('/preview')
        } catch (e) {
            error = 'Something went wrong. Please try again.'
        } finally {
            isGenerating = false
        }
    }
</script>

<!-- landing layout -->
<div class="min-h-screen bg-[#0d0d0d] text-[#f0ede8] font-serif flex flex-col">

    <!-- header -->
    <header class="flex items-center px-10 py-7 border-b border-white/6">
        <span class="text-[18px] font-normal tracking-[0.12em]">Momenti</span>
    </header>

    <!-- main -->
    <main class="flex-1 flex items-center justify-center px-6 py-15">

        {#if isGenerating}
            <Loader />
        {:else}
            <!-- prompt UI -->
            <div class="w-full max-w-180 flex flex-col">
                <h1 class="text-6xl font-normal leading-[1.05] tracking-[-0.03em] mb-5">
                    Your
                    <TypeWriter words={['moment', 'event', 'story', 'identity', 'chapter']}/>
                    ,<br>
                    assisted by AI.
                </h1>
                <p class="font-sans text-[15px] leading-[1.75] text-[#888] mb-10">
                    Describe what you have in mind in plain language and the engine will build a bespoke, styled
                    page.<br>
                    No templates, no limits.
                </p>

                <!-- form card -->
                <div class="bg-white/3 border border-white/10 rounded-2xl p-1 flex flex-col">
                    <textarea
                            class="w-full bg-transparent border-none outline-none resize-none px-5.5 py-5 font-serif text-[17px] leading-[1.7] text-[#f0ede8] caret-[#f0ede8] placeholder-[#3a3a3a]"
                            placeholder="e.g. A bohemian wedding in the woods, May 2026. Earthy tones, lanterns, wildflowers…"
                            bind:value={prompt}
                            rows={4}
                            onkeydown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generateEvent() }}
                    ></textarea>

                    {#if error}
                        <p class="font-sans text-xs text-[#e07070] px-5.5 pb-2">{error}</p>
                    {/if}

                    <div class="flex items-center justify-between py-2.5 pl-5.5 pr-3.5 border-t border-white/6">
                        <span class="font-sans text-[11px] text-[#3a3a3a] tracking-[0.04em]">⌘↵ to generate</span>
                        <button
                                class="flex items-center gap-2 bg-[#f0ede8] text-[#0d0d0d] rounded-[10px] py-3 px-5.5 font-sans text-[13px] font-semibold tracking-[0.04em] transition-[opacity,transform] duration-150 disabled:opacity-[0.22] disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.97]"
                                onclick={generateEvent}
                                disabled={!prompt.trim()}
                        >
                            Generate
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <p class="font-sans text-[11px] text-[#2e2e2e] mt-4 tracking-[0.02em] text-center">
                    © 2026 Momenti. All rights reserved.
                </p>
            </div>
        {/if}

    </main>
</div>

