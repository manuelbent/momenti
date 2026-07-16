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

    <input type="checkbox" class="hidden" aria-label="Toggle menu" />
    <label for={`nav-toggle-${node.id}`} class="hamburger" aria-hidden="true">
        <span></span><span></span><span></span>
    </label>
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

    a:hover {
        opacity: 1;
    }

    /* ── hamburger icon (3 bars) ── */
    .hamburger {
        display: none;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0 0.25rem;
    }

    .hamburger span {
        display: block;
        height: 2px;
        width: 100%;
        background: currentColor; /* inherits navbar color */
        border-radius: 2px;
        transition: transform 0.25s, opacity 0.25s;
    }

    /* ── responsive breakpoint ── */
    @container (max-width: 768px) {
        .nav-links {
            display: none;
        }

        .hamburger {
            display: flex;
        }
    }
</style>