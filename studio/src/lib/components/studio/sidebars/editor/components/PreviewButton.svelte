<script lang="ts">
    import { ExternalLink } from 'lucide-svelte'
    import Button from '$lib/components/ui/Button.svelte'
</script>

<Button onclick={() => window.open('/#/preview', '_blank')}>
    <ExternalLink size={13} strokeWidth={2} />
    Preview
</Button>
