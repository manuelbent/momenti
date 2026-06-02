<script lang="ts">
    import { selectedSection } from '$lib/stores/section'
</script>

<div class="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex items-center justify-center z-20"
     onclick={() => selectedSection.set(null)}
     role="dialog"
     aria-modal="true"
     tabindex="-1">
    <div class="bg-[#f0ede8] rounded-[14px] p-5 w-[min(480px,80%)] shadow-[0_8px_40px_rgba(13,13,13,0.35)] flex flex-col gap-3"
         onmousedown={(e) => e.stopPropagation()}
         onclick={(e) => e.stopPropagation()}
         onkeydown={(e) => e.stopPropagation()}>
        <textarea
                class="w-full bg-transparent border-none outline-none resize-none font-sans text-sm leading-6 text-[#0d0d0d] caret-[#0d0d0d] placeholder-black/35"
                placeholder="What would you like to change in this section?"
                rows="3"
        ></textarea>
    </div>
</div>
