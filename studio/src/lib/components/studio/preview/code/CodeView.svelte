<script lang="ts">
    import { JsonView } from '@zerodevx/svelte-json-view'
    import { Braces } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import CopyButton from './components/CopyButton.svelte'
</script>

<div class="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden border border-ink-accent shadow-2xl">
    <!-- header -->
    <div class="flex items-center justify-between px-4 py-2.5 bg-canvas-dim border-b border-ink-accent shrink-0">
        <div class="flex items-center gap-2 text-ink/40">
            <Braces size={13} strokeWidth={1.6}/>
            <span class="text-[10px] font-mono tracking-wide">{$moment.slug}.json</span>
        </div>

        <CopyButton/>
    </div>

    <!-- code body -->
    <div class="json-wrap flex-1 min-h-0 overflow-auto px-5 py-5 bg-white">
        <JsonView json={$moment?.content}/>
    </div>
</div>

<style>
    .json-wrap {
        font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
        font-size: 0.75rem;
        line-height: 1.7;
        color: var(--color-ink);

        --jsonPaddingLeft: 1.25rem;
        --jsonBorderLeft: 1px solid color-mix(in srgb, var(--color-ink) 8%, transparent);
        --jsonBracketColor: #57606a;
        --jsonBracketHoverBackground: color-mix(in srgb, var(--color-ink) 5%, transparent);
        --jsonSeparatorColor: #57606a;
        --jsonKeyColor: #116329;
        --jsonValColor: var(--color-ink);
        --jsonValStringColor: #0550ae;
        --jsonValNumberColor: #953800;
        --jsonValBooleanColor: #cf222e;
    }
</style>
