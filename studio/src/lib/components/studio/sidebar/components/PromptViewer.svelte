<script lang="ts">
    import { moment } from '$lib/stores/moment'

    $: prompt = $moment?.prompt
        .replace(/^"|"$/g, '')   // strip surrounding quotes if any
        .replace(/\\n/g, '\n')   // replace literal \n with real newlines
</script>

<div class="flex flex-col gap-1.5">
    <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40 font-sans">Message</span>
    <p class="text-[11px] italic text-[#0d0d0d]/40">{prompt}</p>
</div>
