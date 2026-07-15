<script lang="ts">
    import { Undo, Redo, Save } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import { editorState } from '$lib/stores/editorState'
    import { saveMoment } from '$lib/utils/saveMoment'

    const { change } = $props()

    const loadContent = (content: MomentContent) => {
        moment.update(m => ({ ...m, content }))
        editorState.setDirty()
    }

    let isSaving = $state(false)

    const handleSave = async () => {
        isSaving = true
        try {
            loadContent(change.new_content)
            await saveMoment()
        } finally {
            isSaving = false
        }
    }
</script>

<div class="flex flex-col items-start gap-1" title="{new Date(change.created_at).toLocaleString()}">
    <div class="max-w-[85%] bg-ink-accent/50 border border-ink-accent rounded-xl rounded-tl-xs px-3 py-2 flex items-center gap-2">
        <span class="font-serif text-xs text-ink leading-snug flex-1">
            {#if change.node_id}
                Changes applied to <span class="font-bold">{change.node_id}</span>.
            {:else}
                Changes applied.
            {/if}
        </span>

        <div class="flex gap-1">
            {#if change.old_content}
                <button onclick={() => loadContent(change.old_content)}
                        class="shrink-0 p-1 rounded-md text-ink bg-canvas border border-ink-accent hover:border-ink-accent-hover transition-all duration-150 cursor-pointer"
                        title="Undo">
                    <Undo size={10}/>
                </button>
            {/if}

            <button onclick={() => loadContent(change.new_content)}
                    class="shrink-0 p-1 rounded-md text-ink bg-canvas border border-ink-accent hover:border-ink-accent-hover transition-all duration-150 cursor-pointer"
                    title="Apply">
                <Redo size={10}/>
            </button>

            <button onclick={handleSave} disabled={isSaving}
                    class="shrink-0 p-1 rounded-md text-ink bg-canvas border border-ink-accent hover:border-ink-accent-hover transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Save">
                <Save size={10}/>
            </button>
        </div>
    </div>
</div>