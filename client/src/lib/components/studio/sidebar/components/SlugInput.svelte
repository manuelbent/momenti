<script lang="ts">
    import { type Moment, moment } from '../../../../stores/moment'

    function updateSlug(e: Event) {
        const val = (e.target as HTMLInputElement).value
        moment.update((m: Moment) => m ? { ...m, slug: val } : m)
    }
</script>

<div class="flex flex-col gap-1.5">
    <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40 font-sans">
        Slug
    </span>

    <label for="slug" class="flex items-center border border-[#0d0d0d]/10 rounded-md px-3 py-2 bg-white focus-within:border-[#0d0d0d]/30 transition-colors cursor-text">
        <span class="text-[12px] text-[#0d0d0d]/25 font-mono shrink-0">https://</span>
        <input
                id="slug"
                type="text"
                value={$moment?.slug ?? ''}
                oninput={updateSlug}
                placeholder="your-slug"
                class="flex-1 text-[12px] font-mono text-[#0d0d0d] bg-transparent outline-none placeholder:text-[#0d0d0d]/25"
        />
        <span class="text-[12px] text-[#0d0d0d]/25 font-mono shrink-0">.momenti.ai</span>
    </label>
</div>
