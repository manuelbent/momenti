<script lang="ts">
    export let disabled: boolean = false
    export let onclick: () => void = () => {}
</script>

<button
    {onclick}
    {disabled}
    class="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md border border-[#0d0d0d]/6 text-[12px] text-[#0d0d0d]/40 tracking-[0.08em] cursor-pointer transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"
         class="transition-transform duration-500 group-hover:rotate-180">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
    </svg>
    Re-generate
</button>
