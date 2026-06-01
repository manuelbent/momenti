<script lang="ts">
    import { ImagePlus } from 'lucide-svelte'
    import { selectedNode, addChildNode } from '$lib/stores/momentContent'
    import { registerImage } from '$lib/utils/imageUpload'

    let fileInput: HTMLInputElement

    const handleFileSelected = (e: Event) => {
        if (!$selectedNode?.id) return
        const file = (e.target as HTMLInputElement).files?.[0]
        if (!file) return
        const newSlide: MomentNode = {
            id: `slide-${Date.now()}`,
            type: 'image',
            src: registerImage(file),
            alt: file.name.replace(/\.[^/.]+$/, ''),
        }
        addChildNode($selectedNode.id, newSlide);
        (e.target as HTMLInputElement).value = ''
    }
</script>

<button class="py-1 px-2.5 border border-[#e4e0dc] hover:border-black/20 rounded-md text-[#0d0d0d] text-xs font-[inherit] cursor-pointer
               transition-colors flex items-center justify-center"
        onclick={() => fileInput.click()}
        title="Upload image">
    <ImagePlus class="w-3"/>
</button>
<input bind:this={fileInput} type="file" accept="image/*" onchange={handleFileSelected} hidden/>

<div class="h-px bg-black/8 -mx-1.5 my-2"></div>

