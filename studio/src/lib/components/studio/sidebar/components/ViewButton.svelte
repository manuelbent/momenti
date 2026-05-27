<script lang="ts">
    import { ExternalLink } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import Button from '$lib/components/ui/Button.svelte'

    const href = import.meta.env.VITE_ENV === 'local' ?
        `http://${$moment.slug}.localhost:5174` :
        `https://${$moment.slug}.momenti.cc`
</script>

<Button onclick={() => window.open(href, '_blank')}>
    <ExternalLink size={13} strokeWidth={2} />
    View
</Button>
