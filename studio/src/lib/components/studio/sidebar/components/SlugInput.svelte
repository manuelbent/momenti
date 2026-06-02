<script lang="ts">
    import { moment } from '$lib/stores/moment'
    import { editorState } from '$lib/stores/editorState'
    import { checkSlugAvailability } from '$lib/api/moments'
    import { LoaderCircle } from 'lucide-svelte'

    $: slug = $moment?.slug ?? ''

    let debounceTimer: ReturnType<typeof setTimeout>

    $: checking = $editorState.slugChecking
    $: isSlugAvailable = $editorState.slugAvailable

    // Cancel any pending check when the moment changes (editorState resets via its own subscriber)
    let previousMomentId: number | null = null
    $: if ($moment?.id !== previousMomentId) {
        clearTimeout(debounceTimer)
        previousMomentId = $moment?.id ?? null
    }

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
            editorState.setSlugAvailable(null)
            editorState.setSlugChecking(false)
            return
        }

        editorState.setSlugChecking(true)
        const momentId = $moment.id
        debounceTimer = setTimeout(async () => {
            const available = await checkSlugAvailability(sanitized, momentId)
            editorState.setSlugAvailable(available)
            editorState.setSlugChecking(false)
        }, 800)
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
           class="flex items-center border border-[#0d0d0d]/10 rounded-md px-3 py-2 bg-white  transition-colors cursor-text {isSlugAvailable ? 'border-[#7dc59a]' : isSlugAvailable === false ? 'border-[#d58985]' : ''}">
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
