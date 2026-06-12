<script lang="ts">
    export let onclick: (e?: any) => void
    export let disabled: boolean = false
    export let className: string = ''
</script>

<button {disabled}
        {onclick}
        class="p-1.5 rounded-full text-white
             bg-ink-faint hover:bg-ink-faint-hover
             disabled:bg-canvas
             cursor-pointer disabled:cursor-default
             transition-colors duration-200 {className}">
    <slot/>
</button>
