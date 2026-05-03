<script lang="ts">
    import Button from '../../../ui/Button.svelte'

    export let onclick: () => void = () => {}
</script>

<Button {onclick} class="text-[#f0ede8] bg-[#0d0d0d]/40 overflow-hidden">
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 20h14"/>
        <g class="transition-transform duration-300 group-hover:-translate-y-1">
            <path d="M12 4v12"/>
            <path d="M8 8l4-4 4 4"/>
        </g>
    </svg>
    Publish
</Button>
