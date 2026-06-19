<script lang="ts">
    import { Signal, Wifi, BatteryMedium } from 'lucide-svelte'
    import Time from './Time.svelte'
    import DynamicIsland from './DynamicIsland.svelte'
</script>

<div class="relative flex items-center align-middle justify-between px-6 pt-3 pb-2 bg-white shrink-0">

    <Time/>

    <DynamicIsland/>

    <div class="flex gap-1">
        <Signal size={12} class="text-ink-accent"/>
        <Wifi size={12} class="text-ink-accent"/>
        <BatteryMedium size={12} class="text-ink-accent"/>
    </div>
</div>


