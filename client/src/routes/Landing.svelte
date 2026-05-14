<script lang="ts">
    import { fade } from 'svelte/transition'
    import { push } from 'svelte-spa-router'
    import { SwatchBook } from 'lucide-svelte'
    import { capture } from '$lib/api/moments'
    import { moment } from '$lib/stores/moment'
    import { inviteKey } from '$lib/stores/auth'
    import Loader from '$lib/components/landing/Loader.svelte'
    import TypeWriter from '$lib/components/landing/TypeWriter.svelte'
    import InviteModal from '$lib/components/landing/InviteModal.svelte'

    let prompt = $state('')
    let isCapturing = $state(false)
    let isLeaving = $state(false)
    let error = $state('')
    let streamText = $state('')
    let showInviteModal = $state(false)

    function handleCapture() {
        if (!prompt.trim()) {
            return
        }

        if (!$inviteKey) {
            showInviteModal = true
            return
        }

        captureMoment()
    }

    function onUnlock() {
        showInviteModal = false
        captureMoment()
    }

    async function captureMoment() {
        if (!prompt.trim()) {
            return
        }

        isCapturing = true
        isLeaving = false
        error = ''
        streamText = ''

        try {
            await capture(prompt.trim(), {
                onChunk: (chunk) => {
                    streamText += chunk
                },
                onDone: (data) => {
                    moment.set(data)
                    isLeaving = true
                    setTimeout(() => push('/studio'), 450)
                },
            })
        } catch (e) {
            console.error(e)
            error = 'Something went wrong. Please try again.'
            isCapturing = false
        }
    }
</script>

<!-- landing layout -->
<div
        class="min-h-screen bg-[#0d0d0d] text-[#f0ede8] font-serif flex flex-col transition-opacity duration-400"
        class:opacity-0={isLeaving}
>

    <!-- header -->
    <header class="flex items-center px-6 md:px-10 py-7 border-b border-white/6">
        <span class="text-[18px] font-normal tracking-[0.12em]">momenti</span>
        {#if $inviteKey}
            <a href="/#/studio" class="ml-auto text-[#888] hover:text-[#f0ede8] transition-colors duration-150">
                <SwatchBook size={20} strokeWidth={1.5}/>
            </a>
        {/if}

    </header>

    <!-- main -->
    <main class="flex-1 flex items-center justify-center px-6 py-15">
        <div class="w-full max-w-180 flex flex-col">
            <h1 class="text-5xl md:text-6xl font-normal leading-[1.05] tracking-[-0.03em] mb-5">
                Your <TypeWriter/><span class="-ml-1">,</span><br>
                one message away.
            </h1>
            <p class="font-sans text-[15px] leading-[1.75] text-[#888] mb-10">
                What do you have in mind?<br>
                What would you like your moment to look like?<br>
                Feel free to be creative: colors, mood, vibes, anything you can think of.<br>
                Let momenti create it for you.
            </p>

            <div class="grid min-h-57.5">
                {#if isCapturing}
                    <!-- loader replaces the form card -->
                    <div class="[grid-area:1/1] h-full flex items-center justify-center"
                         transition:fade={{ duration: 400 }}>
                        <Loader {streamText}/>
                    </div>
                {:else}
                    <!-- form card -->
                    <div class="[grid-area:1/1]" transition:fade={{ duration: 300 }}>
                        <div class="bg-white/3 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
                        <textarea
                                class="w-full bg-transparent border-none outline-none resize-none px-5.5 py-5 font-serif text-[17px] leading-[1.7] text-[#f0ede8] caret-[#f0ede8] placeholder-[#3a3a3a]"
                                placeholder="e.g. A wedding in the woods, May 2026. Earthy tones, lanterns, wildflowers..."
                                bind:value={prompt}
                                rows={4}
                                onkeydown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCapture() }}
                        ></textarea>

                            {#if error}
                                <p class="font-sans text-xs text-[#e07070] px-5.5 pb-2">{error}</p>
                            {/if}

                            <div class="flex items-center justify-between py-2.5 pl-5.5 pr-3.5 border-t border-white/6">
                                <span class="font-sans text-[11px] text-[#3a3a3a] tracking-[0.04em]">⌘↵ to capture</span>
                                <button class="flex items-center gap-2 bg-[#f0ede8] text-[#0d0d0d] rounded-[10px] py-3 px-5.5 font-sans text-[13px] font-semibold tracking-[0.04em] transition-[opacity,transform] duration-150 disabled:opacity-[0.22] disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.97]"
                                        onclick={handleCapture}
                                        disabled={!prompt.trim()}
                                >Capture
                                </button>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>

            <p class="font-sans text-[11px] text-[#2e2e2e] mt-4 tracking-[0.02em] text-center">
                © 2026 momenti. All rights reserved.
                <br>
                v0.0.0-alpha
            </p>
        </div>
    </main>
</div>

{#if showInviteModal}
    <InviteModal {onUnlock} onClose={() => (showInviteModal = false)} />
{/if}
