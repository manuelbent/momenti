<script lang="ts">
    import { getContext } from 'svelte'

    export let id: string = ''
    export let href: string = ''
    export let html: string = ''
    export let css: string = ''
    export let isSelected: boolean = false
    export let onSelect: (() => void)|undefined = undefined

    const viewOnly = getContext<boolean>('viewOnly') ?? false

    const handleClick = (e: Event) => {
        if (!viewOnly) {
            e.preventDefault()
            onSelect?.()
        }
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
<a
        {id}
        data-nid={id}
        href={href || '#'}
        target="_blank"
        rel="noopener noreferrer"
        style={css}
        class:momenti-selected={isSelected}
        onclick={handleClick}
>
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html html}
</a>
