<script lang="ts">
    let {
        prompt = $bindable(''),
        error = '',
        onCapture,
    }: {
        prompt?: string
        error?: string
        onCapture: () => void
    } = $props()
</script>

<div class="bg-white/3 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
    <textarea
            class="w-full bg-transparent border-none outline-none resize-none px-5.5 py-5 font-serif text-[17px] leading-[1.7] text-[#f0ede8] caret-[#f0ede8] placeholder-[#3a3a3a]"
            placeholder="e.g. A wedding in the woods, May 2026. Earthy tones, lanterns, wildflowers..."
            bind:value={prompt}
            rows={4}
            onkeydown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onCapture() }}
    ></textarea>

    {#if error}
        <p class="font-sans text-xs text-[#e07070] px-5.5 py-2">{error}</p>
    {/if}

    <div class="flex items-center justify-between py-2.5 pl-5.5 pr-3.5 border-t border-white/6">
        <span class="font-sans text-[11px] text-[#3a3a3a] tracking-[0.04em]">⌘↵ to capture</span>
        <button
                class="flex items-center gap-2 bg-[#f0ede8] text-[#0d0d0d] rounded-[10px] py-3 px-5.5 font-sans text-[13px] font-semibold tracking-[0.04em] transition-[opacity,transform] duration-150 disabled:opacity-[0.22] disabled:cursor-not-allowed enabled:cursor-pointer enabled:hover:opacity-[0.88] enabled:active:scale-[0.97]"
                onclick={onCapture}
                disabled={!prompt.trim()}
        >Capture
        </button>
    </div>
</div>
