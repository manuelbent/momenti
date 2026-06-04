<script lang="ts">
    import { CloudDownload } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import { showToast } from '$lib/stores/toast'
    import Button from '$lib/components/ui/Button.svelte'
    import { downloadFormSubmissions } from '$lib/api'


    async function handleDownload() {
        if (!$moment) return

        try {
            await downloadFormSubmissions($moment.slug)
        } catch (err) {
            console.log(err)
            showToast('Something went wrong.', 'error')
        }
    }
</script>

<Button onclick={handleDownload}>
    <CloudDownload size={12} strokeWidth={1.8}/>
    See responses
</Button>
