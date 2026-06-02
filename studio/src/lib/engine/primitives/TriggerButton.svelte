<script lang="ts">
    import { fade } from 'svelte/transition'
    import { Brush } from 'lucide-svelte'

    const { onclick }: { onclick: () => void } = $props()
</script>

<button {onclick}
        transition:fade={{ duration: 120 }}
        class="absolute bg-[#f0ede8] p-2 rounded-full bottom-6 right-6 text-[10px] text-[#0d0d0d]/35 hover:text-[#0d0d0d]/70 cursor-pointer z-10">
    <Brush size={16} strokeWidth={2}/>
</button>
