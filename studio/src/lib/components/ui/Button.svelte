<script lang="ts">
    export let disabled: boolean = false
    export let onclick: () => void = () => {}

    export let className: string = ''
</script>

<button
        {onclick}
        {disabled}
        class="group flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-md
                text-[12px] tracking-[0.08em] border
                text-ink-faint hover:text-ink-faint-hover
                border-ink-accent hover:border-ink-accent-hover
                disabled:text-ink-accent disabled:hover:border-ink-accent
                transition-colors duration-150
                cursor-pointer disabled:cursor-default {className}">
    <slot/>
</button>
