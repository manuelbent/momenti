<script lang="ts">
    import { CloudUpload } from 'lucide-svelte'
    import Button from '../../../ui/Button.svelte'
    import { moment } from '../../../../stores/moment'
    import { showToast } from '../../../../stores/toast'

    async function handleSave() {
        if (!$moment) {
            return
        }

        const res = await fetch(`http://localhost:3000/api/moments/${$moment.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                slug: $moment.slug,
                content: $moment.content
            }),
        })

        if (res.ok) {
            const updated: Moment = await res.json()
            moment.set(updated)
            showToast('Moment updated.')
        } else {
            console.log(res)
            showToast('Something went wrong.', 'error')
        }
    }
</script>

<Button onclick={handleSave}>
    <CloudUpload size={13} strokeWidth={1.8} />
    Save
</Button>
