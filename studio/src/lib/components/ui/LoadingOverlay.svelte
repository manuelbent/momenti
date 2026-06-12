<script lang="ts">
    import { fade } from 'svelte/transition'
    import { isLoading } from '$lib/stores/moment'
</script>

{#if $isLoading}
    <div
            class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas"
            out:fade={{ duration: 600, delay: 120 }}
    >
        <!-- spinner ring -->
        <div class="relative w-9 h-9">
            <!-- static track -->
            <div class="absolute inset-0 rounded-full border border-ink/10"></div>
            <!-- orbiting arc -->
            <div
                    class="absolute inset-0 rounded-full border border-transparent border-t-ink/40"
                    style="animation: orbit 1.4s linear infinite;"
            ></div>
        </div>
    </div>
{/if}

