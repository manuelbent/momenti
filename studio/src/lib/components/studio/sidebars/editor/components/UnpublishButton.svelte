<script lang="ts">
    import { GlobeX } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import { showToast } from '$lib/stores/toast'
    import { updateMoment } from '$lib/api'
    import Button from '$lib/components/ui/Button.svelte'

    async function handleUnpublish() {
        if (!$moment) return

        try {
            const updated: Moment = await updateMoment($moment.id, { is_published: false })
            moment.set(updated)
            showToast('Moment unpublished.')
        } catch {
            showToast('Something went wrong.', 'error')
        }
    }
</script>

<Button onclick={handleUnpublish}>
    <GlobeX size={12} strokeWidth={1.8}/>
    Unpublish
</Button>
