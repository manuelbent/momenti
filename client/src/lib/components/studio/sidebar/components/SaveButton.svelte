<script lang="ts">
    import { CloudUpload } from 'lucide-svelte'
    import Button from '$lib/components/ui/Button.svelte'
    import { moment } from '$lib/stores/moment'
    import { showToast } from '$lib/stores/toast'
    import { updateMoment } from '$lib/api'

    async function handleSave() {
        if (!$moment) return

        try {
            const updated: Moment = await updateMoment($moment.id, {
                slug: $moment.slug,
                content: $moment.content,
            })
            moment.set(updated)
            showToast('Moment updated.')
        } catch {
            showToast('Something went wrong.', 'error')
        }
    }
</script>

<Button onclick={handleSave}>
    <CloudUpload size={13} strokeWidth={1.8} />
    Save
</Button>
