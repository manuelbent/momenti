<script lang="ts">
    import { Braces } from 'lucide-svelte'

    export let active: boolean = false
    export let onclick: () => void = () => {}
</script>

<button {onclick}
        class="cursor-pointer transition-opacity duration-150 {active ? 'opacity-100' : 'opacity-25 hover:opacity-50'}"
        title="Code"
>
    <Braces size={14} strokeWidth={1.6}/>
</button>
