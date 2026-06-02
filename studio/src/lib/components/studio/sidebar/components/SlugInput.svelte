<script lang="ts">
    import { moment } from '$lib/stores/moment'
    import { checkSlugAvailability } from '$lib/api/moments'
    import { LoaderCircle } from 'lucide-svelte'

    $: slug = $moment?.slug ?? ''

    let checking = false
    let isSlugAvailable: boolean|null = null
    let debounceTimer: ReturnType<typeof setTimeout>

    function sanitize(value: string, trim = false): string {
        let s = value
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-{2,}/g, '-')
            .slice(0, 50)
        if (trim) s = s.replace(/^-+|-+$/g, '')
        return s
    }

    function oninput(e: Event) {
        clearTimeout(debounceTimer)

        const input = e.target as HTMLInputElement
        const sanitized = sanitize(input.value)
        $moment.slug = sanitized
        input.value = sanitized

        if (!sanitized) {
            isSlugAvailable = null
            checking = false
            return
        }

        checking = true
        debounceTimer = setTimeout(async () => {
            isSlugAvailable = await checkSlugAvailability(sanitized, $moment.id)
            checking = false
        }, 400)
    }

    function onblur(e: Event) {
        const input = e.target as HTMLInputElement
        const sanitized = sanitize(input.value, true)
        $moment.slug = sanitized
        input.value = sanitized
    }
</script>

<div class="flex flex-col gap-1.5">
    <div class="flex items-center justify-between w-full">
        <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40">Address</span>
        {#if checking}
            <span class="text-[8px] text-[#0d0d0d]/25">
                <LoaderCircle class="animate-spin" size={12} />
            </span>
        {/if}
    </div>

    <label for="slug"
           class="flex items-center border border-[#0d0d0d]/10 rounded-md px-3 py-2 bg-white  transition-colors cursor-text {isSlugAvailable ? 'border-[#A8D5BA]' : isSlugAvailable === false ? 'border-[#F2B8B5]' : ''}">
        <span class="text-[12px] text-[#0d0d0d]/25 shrink-0">https://</span>
        <input id="slug"
               type="text"
               bind:value={slug}
               {onblur}
               {oninput}
               maxlength={50}
               placeholder="your-slug"
               class="flex-1 text-[12px] text-[#0d0d0d] bg-transparent outline-none placeholder:text-[#0d0d0d]/25"
        />
        <span class="text-[12px] text-[#0d0d0d]/25 shrink-0">.momenti.cc</span>
    </label>
</div>
