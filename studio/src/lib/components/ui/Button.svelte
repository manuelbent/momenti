<script lang="ts">
    export let disabled: boolean = false
    export let onclick: () => void = () => {}
    let className: string = 'border border-[#0d0d0d]/6 text-[#0d0d0d]/40'
    export { className as class }
</script>

<button
        {onclick}
        {disabled}
        class="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md text-[12px] tracking-[0.08em] cursor-pointer hover:border-black/15 transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed {className}"
>
    <slot/>
</button>
