<script lang="ts">
    export let node: MomentNode

    $: links = (node as any).links as { label: string; href: string }[] ?? []

    const year = new Date().getFullYear()
</script>

<footer id={node.id} data-nid={node.id} style={node.css}
    class="box-border flex flex-col items-center gap-4 px-[6%] py-8 border-t border-white/15 text-center">

    {#if node.html}
        <p class="text-inherit">{node.html}</p>
    {/if}

    {#if links.length > 0}
        <nav class="flex flex-wrap justify-center gap-x-1">
            {#each links as link}
                <a href={`#${link.href}`}
                   class="inline-block px-2.5 py-0.5 text-[0.78rem] tracking-wide opacity-70 hover:opacity-100 transition-opacity no-underline text-inherit">
                    {link.label}
                </a>
            {/each}
        </nav>
    {/if}

    <p class="m-0 text-[0.65rem] tracking-wide opacity-40 text-inherit">
        © {year} made with <a href="https://momenti.cc" target="_blank" rel="noopener noreferrer">momenti</a>
    </p>
</footer>
