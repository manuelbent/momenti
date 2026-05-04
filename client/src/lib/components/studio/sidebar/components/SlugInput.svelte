<script lang="ts">
    import { moment } from '../../../../stores/moment'
    import { showToast } from '../../../../stores/toast'

    let slug = $moment?.slug ?? ''

    $: if ($moment?.slug) {
        slug = $moment.slug
    }

    async function onblur() {
        const params = new URLSearchParams({ slug, excludeId: String($moment.id) })
        const res = await fetch(`http://localhost:3000/api/moments/check-slug?${params}`, {
            headers: {
                'x-invite-key': localStorage.getItem('momenti__invite_key') ?? ''
            }
        })
        const { isAvailable } = await res.json()
        if (!isAvailable) {
            showToast('This address is already taken.', 'error')
            return
        }

        moment.update(m => ({ ...m, slug }))
    }
</script>

<div class="flex flex-col gap-1.5">
    <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40">Address</span>

    <label for="slug"
           class="flex items-center border border-[#0d0d0d]/10 rounded-md px-3 py-2 bg-white focus-within:border-[#0d0d0d]/30 transition-colors cursor-text">
        <span class="text-[12px] text-[#0d0d0d]/25 shrink-0">https://</span>
        <input
                id="slug"
                type="text"
                bind:value={slug}
                {onkeyup}
                {onblur}
                placeholder="your-slug"
                class="flex-1 text-[12px] text-[#0d0d0d] bg-transparent outline-none placeholder:text-[#0d0d0d]/25"
        />
        <span class="text-[12px] text-[#0d0d0d]/25 shrink-0">.momenti.ai</span>
    </label>
</div>
