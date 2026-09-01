<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { push } from 'svelte-spa-router'
    import { capture, resume } from '$lib/api/moments'
    import { moment } from '$lib/stores/moment'
    import { inviteKey } from '$lib/stores/auth'
    import Navbar from '$lib/components/landing/components/Navbar.svelte'
    import Hero from '$lib/components/landing/components/hero/Hero.svelte'
    import StreamingPreview from '$lib/components/landing/components/StreamingPreview.svelte'
    import FormCard from '$lib/components/landing/components/FormCard.svelte'
    import InviteModal from '$lib/components/landing/InviteModal.svelte'
    import Footer from '$lib/components/landing/components/Footer.svelte'

    let prompt = $state('')
    let error = $state('')
    let streamText = $state('')
    let showInviteModal = $state(false)
    let loading = $state(true)
    let generationStage = $state<'form'|'empty'|'resizing'|'preview'>('form')

    const FORM_FADE_DURATION = 350
    const TRANSITION_PAUSE = 100
    const RESIZE_DURATION = 700
    const wait = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

    async function showStreamingPreview() {
        const steps = [
            ['empty', FORM_FADE_DURATION + TRANSITION_PAUSE],
            ['resizing', RESIZE_DURATION],
        ] as const

        for (const [stage, duration] of steps) {
            generationStage = stage
            await wait(duration)
            if (generationStage !== stage) return
        }
        generationStage = 'preview'
    }

    onMount(async () => {
        if (!$inviteKey) {
            loading = false
            return
        }

        try {
            await resume({
                onIdle: () => {
                    loading = false
                },
                onChunk: (chunk) => {
                    loading = false
                    generationStage = 'preview'
                    streamText += chunk
                },
                onDone: (data) => {
                    moment.set(data)
                    setTimeout(() => push('/studio'), 450)
                },
            })
        } catch {
            loading = false
        }
    })

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

        error = ''
        streamText = ''
        generationStage = 'empty'

        try {
            await capture(prompt.trim(), {
                onChunk: (chunk) => {
                    if (generationStage === 'empty') {
                        showStreamingPreview()
                    }
                    streamText += chunk
                },
                onError: (error) => {
                    throw error
                },
                onDone: (data) => {
                    moment.set(data)
                    setTimeout(() => push('/studio'), 450)
                },
            })
        } catch (e) {
            error = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
            generationStage = 'form'
        }
    }
</script>

<div class="min-h-screen bg-canvas flex flex-col transition-opacity duration-400">

    <Navbar/>

    <main class="flex-1 flex items-center justify-center px-6 py-10">
        <div class="w-full max-w-180 flex flex-col gap-5">
            <Hero/>

            <div class="grid w-full min-w-0 transition-[height] duration-700 ease-out"
                 class:h-57.5={generationStage === 'form' || generationStage === 'empty'}
                 class:h-[clamp(18rem,42vh,27rem)]={generationStage === 'resizing' || generationStage === 'preview'}>
                {#if loading}
                    <!-- -->
                {:else if generationStage === 'preview'}
                    <div class="[grid-area:1/1] flex h-full w-full min-w-0 items-center justify-center pt-2"
                         in:fade={{ duration: 550 }}>
                        <StreamingPreview {streamText}/>
                    </div>
                {:else if generationStage === 'form'}
                    <div class="[grid-area:1/1] h-full"
                         in:fade={{ duration: 400 }}
                         out:fade={{ duration: FORM_FADE_DURATION }}>
                        <FormCard bind:prompt {error} onCapture={handleCapture}/>
                    </div>
                {/if}
            </div>

            <Footer/>
        </div>
    </main>
</div>

{#if showInviteModal}
    <InviteModal {onUnlock} onClose={() => (showInviteModal = false)}/>
{/if}
