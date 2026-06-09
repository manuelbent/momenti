<script lang="ts">
    let { message } = $props()
</script>

<div class="flex flex-col items-end gap-1">
    <div class="max-w-[85%] bg-[#0d0d0d]/4 border border-[#0d0d0d]/8 rounded-xl rounded-tr-xs px-3 py-2 flex items-center gap-2">
        <p class="font-serif text-xs text-[#0d0d0d] leading-snug whitespace-pre-wrap">{message}</p>
    </div>
</div>
