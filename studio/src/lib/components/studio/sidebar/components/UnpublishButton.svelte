<script lang="ts">
    import { EyeOff } from 'lucide-svelte'
    import Button from '$lib/components/ui/Button.svelte'
    import { moment } from '$lib/stores/moment'
    import { showToast } from '$lib/stores/toast'
    import { updateMoment } from '$lib/api'

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

<Button onclick={handleUnpublish} class="text-[#f0ede8] bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/50">
    <EyeOff size={12} strokeWidth={1.8}/>
    Unpublish
</Button>
