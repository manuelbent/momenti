<script lang="ts">
    import { JsonView } from '@zerodevx/svelte-json-view'
    import { Braces } from 'lucide-svelte'
    import { moment } from '$lib/stores/moment'
    import CopyButton from './components/CopyButton.svelte'
</script>

<!-- outer shell matches DesktopFrame -->
<div class="flex-1 min-h-0 flex flex-col rounded-xl overflow-hidden shadow-2xl shadow-[#0d0d0d]/8 border border-[#0d0d0d]/8">

    <!-- header bar -->
    <div class="flex items-center justify-between px-4 py-2.5 bg-[#e8e4de] border-b border-[#0d0d0d]/8 shrink-0">
        <div class="flex items-center gap-2 text-[#0d0d0d]/40">
            <Braces size={13} strokeWidth={1.6}/>
            <span class="text-[10px] font-mono tracking-wide">{$moment.slug}.json</span>
        </div>

        <CopyButton/>
    </div>

    <!-- code body -->
    <div class="json-wrap flex-1 min-h-0 overflow-auto px-5 py-5">
        <JsonView json={$moment?.content}/>
    </div>
</div>

<style>
    .json-wrap {
        font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
        font-size: 0.75rem;
        line-height: 1.7;
        color: #0d0d0d;

        --jsonPaddingLeft: 1.25rem;
        --jsonBorderLeft: 1px solid rgba(13, 13, 13, 0.08);
        --jsonBracketColor: #57606a;
        --jsonBracketHoverBackground: rgba(13, 13, 13, 0.05);
        --jsonSeparatorColor: #57606a;
        --jsonKeyColor: #116329;
        --jsonValColor: #0d0d0d;
        --jsonValStringColor: #0550ae;
        --jsonValNumberColor: #953800;
        --jsonValBooleanColor: #cf222e;
    }
</style>
