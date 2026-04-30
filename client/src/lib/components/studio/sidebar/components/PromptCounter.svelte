<script lang="ts">
    export let used: number = 0
    export let total: number = 10

    $: pct = (used / total) * 100
</script>

<div class="flex flex-col gap-2">

    <div class="flex items-baseline justify-between">
        <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40">Prompts</span>
        <span class="text-[12px] text-[#0d0d0d]/50">
            <span class="text-[#0d0d0d] font-medium">{used}</span> / {total}
        </span>
    </div>

    <!-- track -->
    <div class="h-0.5 w-full rounded-full bg-[#0d0d0d]/8 overflow-hidden">
        <div
            class="h-full rounded-full bg-[#0d0d0d]/30 transition-all duration-500"
            style="width: {pct}%"
        ></div>
    </div>

</div>
