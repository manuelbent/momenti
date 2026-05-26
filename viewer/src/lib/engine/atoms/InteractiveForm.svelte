<script lang="ts">
    let { data, overrides }: {
        data: { formId: string; inputs: string[]; buttonText: string }
        overrides?: StylingOverrides
    } = $props()

    let values = $state<Record<string, string>>({})
    $effect(() => {
        values = Object.fromEntries(data.inputs.map(k => [k, '']))
    })
    let submitted = $state(false)
    let submitting = $state(false)

    async function handleSubmit(e: SubmitEvent) {
        e.preventDefault()
        submitting = true
        // Placeholder: replace with real API call tied to formId
        await new Promise(r => setTimeout(r, 600))
        submitted = true
        submitting = false
    }

    const alignmentMap = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right'
    }
</script>

<div class="w-full {overrides?.alignment ? alignmentMap[overrides.alignment] : 'text-left'}">
    {#if submitted}
        <div class="py-8 px-6 rounded-(--borderRadiusGlobal) bg-(--color-primary)/10 border border-(--color-primary)/20 text-center">
            <p class="text-lg font-semibold opacity-90">✓ Submitted — thanks!</p>
        </div>
    {:else}
        <form
            id={data.formId}
            onsubmit={handleSubmit}
            class="flex flex-col gap-4
                {overrides?.glassmorphism ? 'backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-(--borderRadiusGlobal)' : ''}"
        >
            {#each data.inputs as inputKey (inputKey)}
                <div class="flex flex-col gap-1.5">
                    <label for="{data.formId}-{inputKey}" class="text-sm font-medium opacity-70 capitalize">
                        {inputKey.replace(/_/g, ' ')}
                    </label>
                    <input
                        id="{data.formId}-{inputKey}"
                        type="text"
                        bind:value={values[inputKey]}
                        autocomplete="off"
                        class="w-full px-4 py-3 rounded-(--borderRadiusGlobal)
                               border border-current/15 bg-white/80
                               text-base outline-none
                               focus:ring-2 focus:ring-(--color-primary)/40 focus:border-(--color-primary)/60
                               transition-all duration-200 placeholder:opacity-40"
                        placeholder={inputKey.replace(/_/g, ' ')}
                        required
                    />
                </div>
            {/each}

            <button
                type="submit"
                disabled={submitting}
                class="mt-2 inline-flex items-center justify-center gap-2
                       px-6 py-3 font-semibold rounded-(--borderRadiusGlobal)
                       bg-(--color-primary) text-white
                       transition-all duration-300
                       hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
                       {overrides?.shadowDepth === 'heavy-glow' ? 'shadow-[0_0_20px_var(--color-primary)]' : 'shadow-md'}"
            >
                {#if submitting}
                    <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                {/if}
                {data.buttonText}
            </button>
        </form>
    {/if}
</div>


