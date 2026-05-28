<script lang="ts">
    import { onMount } from 'svelte'
    import { fade } from 'svelte/transition'
    import { push } from 'svelte-spa-router'
    import { capture, resume } from '$lib/api/moments'
    import { moment } from '$lib/stores/moment'
    import { inviteKey } from '$lib/stores/auth'
    import Navbar from '$lib/components/landing/components/Navbar.svelte'
    import Hero from '$lib/components/landing/components/hero/Hero.svelte'
    import Loader from '$lib/components/landing/components/Loader.svelte'
    import FormCard from '$lib/components/landing/components/FormCard.svelte'
    import InviteModal from '$lib/components/landing/InviteModal.svelte'

    let prompt = $state('')
    let isCapturing = $state(false)
    let isLeaving = $state(false)
    let error = $state('')
    let streamText = $state('')
    let showInviteModal = $state(false)
    let loading = $state(true)

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
                    isCapturing = true
                    streamText += chunk
                },
                onDone: (data) => {
                    moment.set(data)
                    isLeaving = true
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
            error = e instanceof Error ? e.message : 'Something went wrong. Please try again.'
            isCapturing = false
        }
    }
</script>

<div class="min-h-screen bg-[#0d0d0d] text-[#f0ede8] flex flex-col transition-opacity duration-400"
     class:opacity-0={isLeaving}>

    <Navbar/>

    <main class="flex-1 flex items-center justify-center px-6 py-15">
        <div class="w-full max-w-180 flex flex-col">
            <Hero/>

            <div class="grid min-h-57.5">
                {#if loading}
                    <!-- -->
                {:else if isCapturing}
                    <div class="[grid-area:1/1] h-full flex items-center justify-center"
                         transition:fade={{ duration: 400 }}>
                        <Loader {streamText}/>
                    </div>
                {:else}
                    <div class="[grid-area:1/1]" transition:fade={{ duration: 400 }}>
                        <FormCard bind:prompt {error} onCapture={handleCapture}/>
                    </div>
                {/if}
            </div>

            <p class="text-[11px] text-[#2e2e2e] mt-4 tracking-[0.02em] text-center">
                © 2026 momenti. All rights reserved.
                <br>
                <span class="text-[9px]">v{__APP_VERSION__}</span>
            </p>
        </div>
    </main>
</div>

{#if showInviteModal}
    <InviteModal {onUnlock} onClose={() => (showInviteModal = false)}/>
{/if}
