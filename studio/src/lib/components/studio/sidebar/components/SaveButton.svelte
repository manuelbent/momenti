<script lang="ts">
    import { CloudUpload, LoaderCircle } from 'lucide-svelte'
    import Button from '$lib/components/ui/Button.svelte'
    import { moment, savedAt } from '$lib/stores/moment'
    import { showToast } from '$lib/stores/toast'
    import { updateMoment } from '$lib/api'
    import { resolvePendingImages } from '$lib/utils/resolvePendingImages'

    let isSaving = false

    async function handleSave() {
        if (!$moment) {
            return
        }

        isSaving = true
        try {
            const content = await resolvePendingImages($moment.content)
            const updated: Moment = await updateMoment($moment.id, {
                slug: $moment.slug,
                content,
                // include other fields that can be updated here
            })
            moment.set(updated)
            savedAt.set(Date.now())
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
