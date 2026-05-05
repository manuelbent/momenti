<script lang="ts">
    import { RefreshCw } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import { capture } from '$lib/api/moments'
    import Button from '$lib/components/ui/Button.svelte'
    import RecaptureOverlay from '$lib/components/studio/RecaptureOverlay.svelte'

    let isRecapturing = $state(false)
    let confirmPending = $state(false)
    let streamText = $state('')

    function requestRecapture() {
        confirmPending = true
    }

    function cancel() {
        confirmPending = false
    }

    async function confirm() {
        confirmPending = false
        const prompt = $moment?.prompt
        if (!prompt) {
            return
        }

        isRecapturing = true
        streamText = ''

        try {
            await capture(prompt, {
                onChunk: (chunk) => {
                    streamText += chunk
                },
                onDone: (data) => {
                    moment.set(data)
                    setTimeout(() => {
                        isRecapturing = false
                    }, 400)
                },
            })
        } catch (e) {
            console.error(e)
            isRecapturing = false
        }
    }
</script>

{#if isRecapturing}
    <RecaptureOverlay {streamText}/>
{/if}

<div class="grid">
    {#if confirmPending}
        <div class="flex gap-2">
            <Button onclick={cancel}>Cancel</Button>
            <Button onclick={confirm} class="text-[#f0ede8] bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/50">Confirm</Button>
        </div>
    {:else}
        <Button onclick={requestRecapture} disabled={isRecapturing}>
            <RefreshCw size={12} strokeWidth={1.8}/>
            Re-capture
        </Button>
    {/if}
</div>
