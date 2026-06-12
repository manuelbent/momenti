<script lang="ts">
    interface Props {
        icon: any
        title?: string
        active?: boolean
        onclick?: () => void
    }

    let { icon: Icon, title, active = false, onclick }: Props = $props()
</script>

<button {onclick}
        title={title}
        class="w-7 h-8 flex items-center justify-center rounded-l border border-ink-accent text-ink-faint cursor-pointer
               {active ? 'border-r-canvas' : 'border-r-transparent'}">
    <Icon size={12} strokeWidth={1.5}/>
</button>
