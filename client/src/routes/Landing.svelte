<script lang="ts">
    import { fade } from 'svelte/transition'
    import { push } from 'svelte-spa-router'
    import { moment } from '../lib/stores/moment'
    import TypeWriter from '../lib/components/landing/TypeWriter.svelte'
    import Loader from '../lib/components/landing/Loader.svelte'

    let prompt = $state('')
    let isGenerating = $state(false)
    let isLeaving = $state(false)
    let error = $state('')
    let streamText = $state('')

    async function generateEvent() {
        if (!prompt.trim()) return
        isGenerating = true
        isLeaving = false
        error = ''
        streamText = ''

        try {
            const response = await fetchEventStream(prompt.trim())
            await handleStream(response.body!)
        } catch (e) {
            console.error(e)
            error = 'Something went wrong. Please try again.'
        } finally {
            isGenerating = false
        }
    }

    async function fetchEventStream(prompt: string) {
        const response = await fetch('http://localhost:3000/api/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: JSON.stringify(prompt) }),
        })

        if (!response.ok || !response.body) {
            throw new Error(`Unexpected response: ${response.status}`)
        }

        return response
    }

    async function handleStream(stream: ReadableStream<Uint8Array>) {
        const reader = stream
            .pipeThrough(new TextDecoderStream() as unknown as ReadableWritablePair<string, Uint8Array>)
            .getReader()

        let buffer = ''

        while (true) {
            const { value, done } = await reader.read()
            if (done) break

            buffer += value
            const messages = buffer.split('\n\n')
            buffer = messages.pop() ?? ''

            for (const msg of messages) {
                handleMessage(msg)
            }
        }
    }

    function handleMessage(message: string) {
        const event = extract(message, /^event:\s*(\w+)/m)
        const data  = extract(message, /^data:\s*(.+)/ms, JSON.parse)

        if (!event || !data) return

        switch (event) {
            case 'chunk':
                streamText += data.chunk
                break

            case 'done':
                moment.set(data)
                isLeaving = true
                setTimeout(() => push('/preview'), 450)
                break

            case 'error':
                throw new Error(data.error)
        }
    }

    function extract<T>(text: string, regex: RegExp, transform: (v: string) => T = (v) => v as unknown as T): T | null {
        const match = text.match(regex)
        return match ? transform(match[1]) : null
    }
</script>

<!-- landing layout -->
<div
    class="min-h-screen bg-[#0d0d0d] text-[#f0ede8] font-serif flex flex-col transition-opacity duration-400"
    class:opacity-0={isLeaving}
>

    <!-- header -->
    <header class="flex items-center px-10 py-7 border-b border-white/6">
        <span class="text-[18px] font-normal tracking-[0.12em]">momenti</span>
    </header>

    <!-- main -->
    <main class="flex-1 flex items-center justify-center px-6 py-15">
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

            <div class="grid min-h-57.5">
                {#if isGenerating}
                    <!-- loader replaces the form card -->
                    <div class="[grid-area:1/1] h-full flex items-center justify-center" transition:fade={{ duration: 400 }}>
                        <Loader {streamText}/>
                    </div>
                {:else}
                    <!-- form card -->
                    <div class="[grid-area:1/1]" transition:fade={{ duration: 300 }}>
                        <div class="bg-white/3 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
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
                    </div>
                {/if}
            </div>

            <p class="font-sans text-[11px] text-[#2e2e2e] mt-4 tracking-[0.02em] text-center">
                © 2026 momenti. All rights reserved.
            </p>
        </div>
    </main>
</div>

