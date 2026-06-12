<script lang="ts">
    export let onclick: () => void
    export let disabled: boolean = false
    export let size: number = 12
    export let Icon: any
</script>

<button {disabled}
        {onclick}
        class="p-1.5 rounded-full text-white
             bg-ink-faint hover:bg-ink-faint-hover
             disabled:bg-canvas
               cursor-pointer disabled:cursor-default
               transition-colors duration-200">
    <Icon {size}/>
</button>
