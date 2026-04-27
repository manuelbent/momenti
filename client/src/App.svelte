<script lang="ts">
    import Renderer from './lib/engine/Renderer.svelte'
    import { moment2 } from './lib/stores/moment'
</script>

<Renderer node={$moment2.root}/>
