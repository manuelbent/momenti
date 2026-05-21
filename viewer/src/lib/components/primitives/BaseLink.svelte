<script lang="ts">
    export let href: string = ''
    export let html: string = ''
    export let css: string = ''
</script>

<a
    href={href || '#'}
    target="_blank"
    rel="noopener noreferrer"
    style={css}
>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
</a>

