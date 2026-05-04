<script lang="ts">
    import { RefreshCw } from 'lucide-svelte'
    import Button from '../../../ui/Button.svelte'

    export let disabled: boolean = false
    export let onclick: () => void = () => {}
</script>

<Button {onclick} {disabled}>
    <RefreshCw size={12} strokeWidth={1.8} />
    Re-capture
</Button>
