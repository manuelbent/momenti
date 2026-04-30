<script lang="ts">
    export let onclick: () => void = () => {}
</script>

<button
    {onclick}
    class="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-[12px] text-[#f0ede8] bg-[#0d0d0d]/40 tracking-[0.08em] cursor-pointer transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed overflow-hidden"
>
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 20h14"/>
        <g class="transition-transform duration-300 group-hover:-translate-y-1">
            <path d="M12 4v12"/>
            <path d="M8 8l4-4 4 4"/>
        </g>
    </svg>
    Publish
</button>
