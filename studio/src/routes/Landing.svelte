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
    let isCapturing = $state(false)
    let error = $state('')
    let streamText = $state('')
    let showInviteModal = $state(false)
    let loading = $state(true)
    let generationStage = $state<'form'|'empty'|'resizing'|'preview'>('form')
    let transitionRun = 0
    const isMockCapture = import.meta.env.DEV && new URLSearchParams(window.location.search).has('mock-capture')

    const wait = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

    async function showStreamingPreview() {
        const run = ++transitionRun
        generationStage = 'empty'
        await wait(450)
        if (run !== transitionRun) return

        generationStage = 'resizing'
        await wait(650)
        if (run !== transitionRun) return

        generationStage = 'preview'
    }

    function showForm() {
        transitionRun++
        generationStage = 'form'
    }

    onMount(async () => {
        if (isMockCapture) {
            loading = false
            return
        }

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
                    isCapturing = true
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

        if (!$inviteKey && !isMockCapture) {
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
        error = ''
        streamText = ''
        void showStreamingPreview()

        try {
            if (isMockCapture) {
                const stored = localStorage.getItem('momenti__preview')
                if (!stored) {
                    error = 'No saved moment found to replay.'
                    isCapturing = false
                    showForm()
                    return
                }

                const mockMoment = JSON.parse(stored) as Moment
                const content = JSON.stringify(mockMoment.content)
                const chunkSize = Math.ceil(content.length / 180)

                for (let index = 0; index < content.length; index += chunkSize) {
                    streamText += content.slice(index, index + chunkSize)
                    await new Promise(resolve => setTimeout(resolve, 25))
                }

                moment.set(mockMoment)
                setTimeout(() => push('/studio'), 450)
                return
            }

            await capture(prompt.trim(), {
                onChunk: (chunk) => {
                    streamText += chunk
                },
                onDone: (data) => {
                    moment.set(data)
                    setTimeout(() => push('/studio'), 450)
                },
            })
        } catch (e) {
            error = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
            isCapturing = false
            showForm()
        }
    }
</script>

<div class="min-h-screen bg-canvas flex flex-col transition-opacity duration-400">

    <Navbar/>

    <main class="flex-1 flex items-center justify-center px-6 py-10">
        <div
            class="w-full max-w-180 flex flex-col gap-5"
        >
            <Hero/>

            <div
                class="grid w-full min-w-0 transition-[height] duration-700 ease-out"
                class:h-57.5={generationStage === 'form' || generationStage === 'empty'}
                class:h-[clamp(18rem,42vh,27rem)]={generationStage === 'resizing' || generationStage === 'preview'}
            >
                {#if loading}
                    <!-- -->
                {:else if generationStage === 'preview'}
                    <div
                        class="[grid-area:1/1] flex h-full w-full min-w-0 items-center justify-center pt-2"
                        in:fade={{ duration: 550 }}
                    >
                        <StreamingPreview {streamText}/>
                    </div>
                {:else if generationStage === 'form'}
                    <div
                        class="[grid-area:1/1] h-full"
                        in:fade={{ duration: 400 }}
                        out:fade={{ duration: 350 }}
                    >
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
