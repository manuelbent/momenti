<script lang="ts">
    import { selectedSection } from '$lib/stores/section'

    export let node: MomentNode

    $: links = (node as any).links as { label: string; anchor: string }[] ?? []

    $: isSelected = $selectedSection?.id === node.id

    function handleClick() {
        selectedSection.set($selectedSection?.id === node.id ? null : node)
    }
</script>

<nav id={node.id}
     data-nid={node.id}
     data-label={node.id}
     style={node.css}
     class:selectable={true}
     class:selected={isSelected}
     onclick={handleClick}
     onkeydown={() => {}}
     role="presentation">
    <div class="nav-links">
        {#each links as link}
            <a href="#_" onclick={(e) => e.preventDefault()}>{link.label}</a>
        {/each}
    </div>
</nav>

<style>
    nav {
        box-sizing: border-box;
        margin-bottom: -4vw;
        position: relative;
        flex-wrap: wrap;
        z-index: 10 !important;
    }

    /* ── desktop links ── */
    .nav-links {
        display: flex;
        align-items: center;
        gap: 0;
    }

    a {
        display: inline-block;
        text-decoration: none;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        opacity: 0.85;
        transition: opacity 0.2s;
        padding: 0 0.75rem;
        color: inherit;
    }
</style>