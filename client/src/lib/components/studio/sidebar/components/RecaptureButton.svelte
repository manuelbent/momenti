<script lang="ts">
    import { RefreshCw } from 'lucide-svelte'
    import { moment } from '../../../../stores/moment'
    import { capture } from '../../../../api/capture'
    import Button from '../../../ui/Button.svelte'
    import RecaptureOverlay from '../../RecaptureOverlay.svelte'

    let isRecapturing = $state(false)
    let streamText = $state('')

    async function recapture() {
        const prompt = $moment?.prompt
        if (!prompt) {
            return
        }

        isRecapturing = true
        streamText = ''

        try {
            await capture(prompt, {
                onChunk: (chunk) => { streamText += chunk },
                onDone: (data) => {
                    moment.set(data)
                    setTimeout(() => { isRecapturing = false }, 400)
                },
            })
        } catch (e) {
            console.error(e)
            isRecapturing = false
        }
    }
</script>

{#if isRecapturing}
    <RecaptureOverlay {streamText} />
{/if}

<Button onclick={recapture} disabled={isRecapturing}>
    <RefreshCw size={12} strokeWidth={1.8} />
    Re-capture
</Button>
