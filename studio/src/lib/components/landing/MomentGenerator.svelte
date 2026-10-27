<script lang="ts">
    import { onMount } from 'svelte'
    import { inviteKey } from '$lib/stores/auth'
    import { createMomentGenerationStore } from '$lib/stores/momentGeneration'
    import GenerationPanel from './components/GenerationPanel.svelte'
    import InviteModal from './InviteModal.svelte'

    let prompt = $state('')
    let showInviteModal = $state(false)
    const generation = createMomentGenerationStore()

    onMount(() => {
        void generation.resume(Boolean($inviteKey))
    })

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
    loading={$generation.loading}
    stage={$generation.stage}
    streamText={$generation.streamText}
    onCapture={capture}
/>

{#if showInviteModal}
    <InviteModal onUnlock={unlock} onClose={() => (showInviteModal = false)}/>
{/if}
