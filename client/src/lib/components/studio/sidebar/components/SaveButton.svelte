<script lang="ts">
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
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
         class="transition-transform duration-150 group-hover:scale-110">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9Z"/>
    </svg>
    Save
</Button>
