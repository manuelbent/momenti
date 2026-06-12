<script lang="ts">
    let { message } = $props()
</script>

<div class="flex flex-col items-end gap-1">
    <div class="max-w-[85%] bg-ink/4 border border-ink/8 rounded-xl rounded-tr-xs px-3 py-2 flex items-center gap-2">
        <p class="font-serif text-xs text-ink leading-snug whitespace-pre-wrap">{message}</p>
    </div>
</div>
