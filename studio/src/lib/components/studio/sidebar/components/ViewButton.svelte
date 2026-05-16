<script lang="ts">
    import { ExternalLink } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import Button from '$lib/components/ui/Button.svelte'
</script>

<Button onclick={() => window.open(`https://${$moment.slug}.momenti.cc`, '_blank')}>
    <ExternalLink size={13} strokeWidth={2} />
    View
</Button>
