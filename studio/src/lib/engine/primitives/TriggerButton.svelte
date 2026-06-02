<script lang="ts">
    const { onclick }: { onclick: () => void } = $props()
</script>

<button {onclick}
        class="absolute bg-[#f0ede8] px-2 py-1 rounded-full bottom-6 right-6 text-[10px] text-[#0d0d0d] cursor-pointer z-10">
    <span class="font-serif text-sm">m</span>
</button>
