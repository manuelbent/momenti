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
        class="w-7 h-8 flex items-center justify-center rounded-l border border-[#0d0d0d]/6 cursor-pointer text-[#0d0d0d]/40
               {active ? 'border-r-[#f1ede9]' : 'border-r-transparent'}">
    <Icon size={12} strokeWidth={1.5}/>
</button>


