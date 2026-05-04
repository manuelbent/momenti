<script lang="ts">
    import { Eye } from 'lucide-svelte'
    import Button from '../../../ui/Button.svelte'
    import { moment } from '../../../../stores/moment'
    import { showToast } from '../../../../stores/toast'

    async function handlePublish() {
        if (!$moment) {
            return
        }

        const res = await fetch(`http://localhost:3000/api/moments/${$moment.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-invite-key': localStorage.getItem('momenti__invite_key') ?? ''
            },
            body: JSON.stringify({ is_published: true }),
        })

        if (res.ok) {
            const updated: Moment = await res.json()
            moment.set(updated)
            showToast('Moment published.')
        } else {
            showToast('Something went wrong.', 'error')
        }
    }
</script>

<Button onclick={handlePublish} class="text-[#f0ede8] bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/50">
    <Eye size={12} strokeWidth={1.8}/>
    Publish
</Button>
