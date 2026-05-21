<script lang="ts">
    import { fade } from 'svelte/transition'
    import { inviteKey } from '$lib/stores/auth'
    import { validateInviteKey } from '$lib/api'

    let { onUnlock, onClose }: { onUnlock: () => void, onClose: () => void } = $props()

    let value = $state('')
    let error = $state('')

    const submit = async () => {
        const { isValid } = await validateInviteKey(value)
        if (!isValid) {
            error = 'Invalid invite key.'
            return
        }

        inviteKey.set(value)
        onUnlock()
    }
</script>

<!-- backdrop -->
<svelte:window onkeydown={(e) => {if (e.key === 'Escape') onClose()}}/>

<div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- blurred overlay — fades independently so backdrop-filter blurs in smoothly -->
    <div class="absolute inset-0 bg-[#0d0d0d]/70 backdrop-blur-md" role="presentation" transition:fade={{ duration: 300 }} onclick={onClose}></div>

    <!-- modal card -->
    <div class="relative z-10 w-full max-w-sm mx-4 bg-[#141414] border border-white/10 rounded-2xl px-8 py-9 flex flex-col gap-5 shadow-2xl"
         transition:fade={{ duration: 250, delay: 50 }}>
        <div class="flex flex-col gap-1.5">
            <h2 class="text-[22px] tracking-[-0.02em] text-[#f0ede8]">Use your invite key</h2>
            <p class="text-[13px] text-[#666] leading-[1.6]">
                Right now, momenti is invite-only.<br>
                Enter your invite key to get started.
            </p>
        </div>

        <div class="flex flex-col gap-2">
            <input type="text"
                   class="w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-[#f0ede8] placeholder-[#3a3a3a] outline-none focus:border-white/25 transition-colors duration-150 tracking-[0.08em]"
                   bind:value
                   onkeydown={(e) => { if (e.key === 'Enter') submit() }}
                   autocomplete="off"
                   spellcheck={false}
            />
            {#if error}
                <p class="text-[12px] text-[#e07070]" transition:fade={{ duration: 150 }}>{error}</p>
            {/if}
        </div>
    </div>
</div>
