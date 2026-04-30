<script lang="ts">
    export let prompt: string = ''
</script>

<div class="flex flex-col gap-1.5">
    <span class="text-[11px] tracking-[0.12em] text-[#0d0d0d]/40 font-sans">Source</span>
    <textarea
        readonly
        bind:value={prompt}
        placeholder="No prompt yet."
        rows={5}
        class="w-full resize-none rounded-md border border-[#0d0d0d]/10 bg-white px-3 py-2.5 text-[12px] font-sans text-[#0d0d0d]/60 leading-relaxed outline-none placeholder:text-[#0d0d0d]/20 cursor-default select-text"
    ></textarea>
</div>
