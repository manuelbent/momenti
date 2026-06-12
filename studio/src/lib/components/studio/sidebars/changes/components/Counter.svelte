<script lang="ts">
    import { MAX_CHANGES_ALLOWED } from '$lib/config/constants'

    export let used: number = 0

    $: pct = (used / MAX_CHANGES_ALLOWED) * 100
</script>

<div class="flex flex-col p-6 gap-2">
    <div class="flex items-baseline justify-between">
        <span class="text-[11px] tracking-[0.12em] text-ink-faint">Changes applied</span>
        <span class="text-[12px] text-ink-faint">
            <span class="text-ink font-medium">{used}</span> / {MAX_CHANGES_ALLOWED}
        </span>
    </div>

    <!-- track -->
    <div class="h-0.5 w-full rounded-full bg-ink-accent/50 overflow-hidden">
        <div class="h-full rounded-full bg-ink-faint transition-all duration-500"
             style="width: {pct}%"></div>
    </div>
</div>
