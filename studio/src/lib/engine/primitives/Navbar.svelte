<script lang="ts">
    export let node: MomentNode

    $: links = (node as any).links as { label: string; anchor: string }[] ?? []

    function scrollTo(e: MouseEvent, anchor: string) {
        e.preventDefault()
        const target = document.getElementById(anchor)
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            // close the drawer after navigation
            const toggle = document.getElementById(`nav-toggle-${node.id}`) as HTMLInputElement
            if (toggle) toggle.checked = false
        }
    }
</script>

<nav id={node.id} data-nid={node.id} style={node.css ?? ''}>
    <!-- desktop links -->
    <div class="nav-links">
        {#each links as link}
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <a href={`#${link.anchor}`} onclick={(e) => scrollTo(e, link.anchor)}>
                {link.label}
            </a>
        {/each}
    </div>

    <!-- hamburger -->
    <input type="checkbox" id={`nav-toggle-${node.id}`} class="nav-toggle" aria-label="Toggle menu" />
    <label for={`nav-toggle-${node.id}`} class="hamburger" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
    </label>

    <!-- mobile drawer -->
    <div class="nav-drawer">
        {#each links as link}
            <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
            <a href={`#${link.anchor}`} onclick={(e) => scrollTo(e, link.anchor)}>
                {link.label}
            </a>
        {/each}
    </div>
</nav>

<style>
    nav {
        box-sizing: border-box;
        margin-bottom: -4vw;
        position: relative;
        flex-wrap: wrap;
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

    /* ── hamburger toggle (hidden checkbox) ── */
    .nav-toggle {
        display: none;
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

    /* animate to X when open */
    .nav-toggle:checked ~ .hamburger span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }
    .nav-toggle:checked ~ .hamburger span:nth-child(2) {
        opacity: 0;
    }
    .nav-toggle:checked ~ .hamburger span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }

    /* ── mobile drawer ── */
    .nav-drawer {
        display: none;
    }

    /* ── responsive breakpoint ── */
    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }

        .hamburger {
            display: flex;
        }

        .nav-drawer {
            /* always in DOM but hidden; toggled by checkbox */
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 3rem;
            left: 0;
            width: 100%;
            background: inherit;
            /* keep style+color constant so only width animates → no flash */
            border-top: 0 solid rgba(128,128,128,0.15);
            padding: 0;
            /* hidden state */
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease, padding 0.3s ease, border-top-width 0.3s ease;
        }

        .nav-toggle:checked ~ .nav-drawer {
            max-height: 20rem;
            padding: 0.5rem 0;
            border-top-width: 1px;
        }

        .nav-drawer a {
            padding: 0.65rem 4%;
            font-size: 0.8rem;
            border-bottom: 1px solid rgba(128,128,128,0.08);
        }
    }
</style>