<script lang="ts">
    import { Monitor, Braces } from 'lucide-svelte'

    export let view: 'desktop' | 'mobile' | 'code' = 'desktop';
</script>

<div class="flex items-center gap-3">
    <button onclick={() => view = 'desktop'}
            class="cursor-pointer transition-opacity duration-150 {view === 'desktop' ? 'opacity-100' : 'opacity-25 hover:opacity-50'}"
            title="Desktop"
    >
        <Monitor size={14} strokeWidth={1.6}/>
    </button>

    <!-- divider -->
    <!--<span class="w-px h-3.5 bg-[#0d0d0d]/15"></span>

    <button onclick={() => view = 'mobile'}
            class="cursor-pointer transition-opacity duration-150 {view === 'mobile' ? 'opacity-100' : 'opacity-25 hover:opacity-50'}"
            title="Mobile"
    >
        <Smartphone size={14} strokeWidth={1.6}/>
    </button>-->

    <!-- divider -->
    <span class="w-px h-3.5 bg-[#0d0d0d]/15"></span>

    <button onclick={() => view = 'code'}
            class="cursor-pointer transition-opacity duration-150 {view === 'code' ? 'opacity-100' : 'opacity-25 hover:opacity-50'}"
            title="Code"
    >
        <Braces size={14} strokeWidth={1.6}/>
    </button>
</div>
