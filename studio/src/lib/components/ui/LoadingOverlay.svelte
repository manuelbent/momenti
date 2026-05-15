<script lang="ts">
    import { fade } from 'svelte/transition'
    import { isLoading } from '$lib/stores/moment'
</script>

{#if $isLoading}
    <div
            class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f0ede8]"
            out:fade={{ duration: 600, delay: 120 }}
    >
        <!-- spinner ring -->
        <div class="relative w-9 h-9">
            <!-- static track -->
            <div class="absolute inset-0 rounded-full border border-[#0d0d0d]/10"></div>
            <!-- orbiting arc -->
            <div
                    class="absolute inset-0 rounded-full border border-transparent border-t-[#0d0d0d]/40"
                    style="animation: orbit 1.4s linear infinite;"
            ></div>
        </div>
    </div>
{/if}

