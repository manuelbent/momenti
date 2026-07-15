<script lang="ts">
    import { CloudUpload, LoaderCircle } from 'lucide-svelte'
    import Button from '$lib/components/ui/Button.svelte'
    import { canSave } from '$lib/stores/editorState'
    import { saveMoment } from '$lib/utils/saveMoment'

    let isSaving = false

    async function handleSave() {
        isSaving = true
        try {
            await saveMoment()
        } finally {
            isSaving = false
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
            event.preventDefault()
            if ($canSave && !isSaving) {
                handleSave()
            }
        }
    }
</script>

<svelte:window onkeydown={handleKeydown} />

<Button onclick={handleSave} disabled={!$canSave || isSaving}>
    {#if isSaving}
        <LoaderCircle size={13} strokeWidth={1.8} class="animate-spin"/>
    {:else}
        <CloudUpload size={13} strokeWidth={1.8} />
    {/if}
    <span>Save</span>
</Button>
