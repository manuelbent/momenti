<script lang="ts">
    import { moment } from '../../../../stores/moment'

    async function handleSave() {
        if (!$moment) {
            return
        }

        const res = await fetch(`http://localhost:3000/api/moments/${$moment.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: $moment.content }),
        })

        if (res.ok) {
            const updated: Moment = await res.json()
            moment.set(updated)
        }
    }
</script>

<button
        onclick={handleSave}
        class="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md border border-[#0d0d0d]/6 text-[12px] text-[#0d0d0d]/40 tracking-[0.08em] cursor-pointer transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
         class="transition-transform duration-150 group-hover:scale-110">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 0 1 0 9Z"/>
    </svg>
    Save
</button>
