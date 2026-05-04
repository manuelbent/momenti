<script lang="ts">
    import { Upload } from 'lucide-svelte'
    import Button from '../../../ui/Button.svelte'

    export let onclick: () => void = () => {}
</script>

<Button {onclick} class="text-[#f0ede8] bg-[#0d0d0d]/40 hover:bg-[#0d0d0d]/50">
    <Upload size={12} strokeWidth={1.8} />
    Publish
</Button>
