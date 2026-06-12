<script lang="ts">
    import { Clipboard, CheckIcon } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'

    $: copied = false

    const copyToClipboard = () => {
        if (!$moment) {
            return
        }

        const jsonString = JSON.stringify($moment.content, null, 2)
        navigator.clipboard.writeText(jsonString)
        copied = true
    }
</script>

<button class="text-ink/40 text-[10px] font-mono tracking-wide cursor-pointer" on:click={copyToClipboard}>
    {#if copied}
        <CheckIcon size={13} strokeWidth={1.6}/>
    {:else}
        <Clipboard size={13} strokeWidth={1.6}/>
    {/if}
</button>
