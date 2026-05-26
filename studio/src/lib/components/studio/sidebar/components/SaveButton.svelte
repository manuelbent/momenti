<script lang="ts">
    import { CloudUpload, LoaderCircle } from 'lucide-svelte'
    import { showToast } from '$lib/stores/toast'
    import { moment } from '$lib/stores/moment'
    import { updateMoment } from '$lib/api'
    import Button from '$lib/components/ui/Button.svelte'

    let isSaving = false

    async function handleSave() {
        if (!$moment) {
            return
        }

        isSaving = true
        try {
            const updated: Moment = await updateMoment($moment.id, {
                slug: $moment.slug,
                // content: $moment.content,
            })
            moment.set(updated)
            showToast('Moment updated.')
        } catch {
            showToast('Something went wrong.', 'error')
        } finally {
            isSaving = false
        }
    }
</script>

<Button onclick={handleSave} disabled={isSaving}>
    {#if isSaving}
        <LoaderCircle size={13} strokeWidth={1.8} class="animate-spin"/>
    {:else}
        <CloudUpload size={13} strokeWidth={1.8} />
    {/if}
    Save
</Button>
