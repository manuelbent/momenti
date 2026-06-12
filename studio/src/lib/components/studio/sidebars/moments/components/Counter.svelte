<script lang="ts">
    export let used: number = 0
    export let total: number = 5

    $: pct = (used / total) * 100
</script>

<div class="flex flex-col gap-2">

    <div class="flex items-baseline justify-between">
        <span class="text-[11px] tracking-[0.12em] text-ink/40">Your moments</span>
        <span class="text-[12px] text-ink/50">
            <span class="text-ink font-medium">{used}</span> / {total}
        </span>
    </div>

    <!-- track -->
    <div class="h-0.5 w-full rounded-full bg-ink/8 overflow-hidden">
        <div
            class="h-full rounded-full bg-ink/30 transition-all duration-500"
            style="width: {pct}%"
        ></div>
    </div>

</div>
