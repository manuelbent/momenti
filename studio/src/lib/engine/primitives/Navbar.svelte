<script lang="ts">
    export let node: MomentNode

    $: links = (node as any).links as { label: string; anchor: string }[] ?? []

    function scrollTo(e: MouseEvent, anchor: string) {
        e.preventDefault()
        const target = document.getElementById(anchor)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
</script>

<nav id={node.id} data-nid={node.id} style={node.css ?? ''}>
    {#each links as link}
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
        <a href={`#${link.anchor}`} onclick={(e) => scrollTo(e, link.anchor)}>
            {link.label}
        </a>
    {/each}
</nav>

<style>
    nav {
        box-sizing: border-box;
        margin-bottom: -4vw;
    }

    a {
        display: inline-block;
        text-decoration: none;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        opacity: 0.85;
        transition: opacity 0.2s;
        padding: 0 0.75rem;
    }

    a:hover {
        opacity: 1;
    }
</style>

