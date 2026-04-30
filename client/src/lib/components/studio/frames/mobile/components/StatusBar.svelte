<script lang="ts">
    import DynamicIsland from './DynamicIsland.svelte'
    import Time from './Time.svelte'
    import Signal from './Signal.svelte'
    import Wifi from './Wifi.svelte'
    import Battery from './Battery.svelte'
</script>

<div class="relative flex items-center justify-between px-6 pt-3 pb-2 bg-white shrink-0">
    <div class="-mt-1 ml-2">
        <Time/>
    </div>

    <div class="-mt-5.5">
        <DynamicIsland/>
    </div>

    <div class="-mt-1 flex items-center gap-1">
        <Signal/>
        <Wifi/>
        <Battery/>
    </div>
</div>


