<script lang="ts">
    import Renderer from './lib/engine/Renderer.svelte'
    import { moment } from './lib/stores/moment'
</script>

<Renderer node={$moment.root}/>
