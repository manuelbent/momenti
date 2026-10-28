<script lang="ts">
    import { inviteKey } from '$lib/stores/auth'
    import { createMomentGenerationStore } from '$lib/stores/momentGeneration'
    import GenerationPanel from './components/GenerationPanel.svelte'
    import InviteModal from './InviteModal.svelte'

    let prompt = $state('')
    let showInviteModal = $state(false)
    const generation = createMomentGenerationStore()

    const capture = () => {
        if (!prompt.trim()) return

        if (!$inviteKey) {
            showInviteModal = true
            return
        }

        void generation.capture(prompt)
    }

    const unlock = () => {
        showInviteModal = false
        void generation.capture(prompt)
    }
</script>

<GenerationPanel
    bind:prompt
    stage={$generation.stage}
    progressStage={$generation.progressStage}
    streamText={$generation.streamText}
    onCapture={capture}
/>

{#if showInviteModal}
    <InviteModal onUnlock={unlock} onClose={() => (showInviteModal = false)}/>
{/if}
