<script lang="ts">
    import { loadFonts } from '$shared/loadFonts'
    import { tick } from 'svelte'
    import { fade } from 'svelte/transition'
    import { parseStreamingMoment } from '$lib/utils/parseStreamingMoment'
    import MomentPage from '$shared/MomentPage.svelte'
    import Renderer from '$lib/engine/StudioRenderer.svelte'

    const { streamText = '', progressStage }: {
        streamText?: string
        progressStage?: CaptureProgressStage
    } = $props()

    const progressLabels: Record<CaptureProgressStage, string> = {
        'preparing': 'Understanding what matters to you',
        'moderating': 'Understanding what matters to you',
        'classifying': 'Understanding what matters to you',
        'planning-image': 'Finding the right feel',
        'generating-image': 'Generating an image',
        'uploading-image': 'Generating an image',
        'generating-moment': 'Making your moment',
    }

    const DESKTOP_WIDTH = 1280
    let containerWidth = $state(0)
    let previewScroll: HTMLDivElement
    let scrollFrame: number|undefined
    const scale = $derived(containerWidth > 0 ? containerWidth / DESKTOP_WIDTH : 1)
    const content = $derived(parseStreamingMoment(streamText))

    $effect(() => {
        loadFonts(content?.fonts)
    })

    $effect(() => {
        streamText
        if (!previewScroll) return

        void tick().then(() => {
            cancelAnimationFrame(scrollFrame ?? 0)
            scrollFrame = requestAnimationFrame(() => {
                previewScroll.scrollTo({
                    top: previewScroll.scrollHeight,
                    behavior: 'smooth',
                })
            })
        })

        return () => cancelAnimationFrame(scrollFrame ?? 0)
    })
</script>

<div class="preview-wrap relative w-full min-w-0">
    <div
            class="preview-shell relative h-[clamp(18rem,42vh,27rem)] w-full overflow-hidden rounded-2xl border border-white/80 bg-white/75"
            aria-label="Your moment is being assembled"
            aria-live="polite"
    >
        <div class="flex h-8 items-center border-b border-black/5 bg-white/75 px-3 backdrop-blur-md">
            <div class="flex gap-1" aria-hidden="true">
                <span class="h-1.5 w-1.5 rounded-full bg-black/8"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-black/8"></span>
                <span class="h-1.5 w-1.5 rounded-full bg-black/8"></span>
            </div>
            <div class="mx-auto flex items-center gap-2 pr-7 text-[9px] tracking-[0.12em] text-black/25">
                <span class="live-dot h-1 w-1 rounded-full bg-black/35"></span>
                <span aria-label="Moment URL">{content?.slug ? `https://${content.slug}.momenti.cc` : ''}</span>
            </div>
        </div>

        <div class="h-[calc(100%-2rem)] overflow-hidden"
             bind:this={previewScroll}
             bind:clientWidth={containerWidth}
        >
            {#if content?.root}
                <div class="pointer-events-none origin-top-left select-none"
                     style="width: {DESKTOP_WIDTH}px; zoom: {scale}; container-type: inline-size;"
                     in:fade={{ duration: 700 }}
                >
                    <MomentPage stylesheet={content.stylesheet}>
                        <Renderer node={content.root}/>
                    </MomentPage>
                </div>
            {:else}
                <div class="flex h-full items-center justify-center">
                    <!-- -->
                </div>
            {/if}
        </div>

        <div class="pointer-events-none absolute inset-x-0 top-8 h-16 bg-linear-to-b from-white/12 to-transparent"
             aria-hidden="true"
        ></div>
        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-white/35 to-transparent"
             aria-hidden="true"
        ></div>
        {#if progressStage && !content?.root}
            <div class="pointer-events-none absolute bottom-4 right-4 max-w-[calc(100%-2rem)] italic text-[11px] font-light tracking-[-0.01em] text-ink-faint/60"
                 role="status"
                 aria-live="polite"
            >
                {progressLabels[progressStage]}<span class="progress-dots" aria-hidden="true">...</span>
            </div>
        {/if}
    </div>
</div>

<style>
    .progress-dots {
        display: inline-block;
        letter-spacing: 0;
        animation: progress-dots 1.6s steps(3, end) infinite;
    }

    @keyframes progress-dots {
        0% {
            clip-path: inset(0 100% 0 0);
        }
        75%, 100% {
            clip-path: inset(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .progress-dots {
            animation: none;
        }
    }

    .preview-wrap::before {
        content: '';
        position: absolute;
        inset: 12% 8% -8%;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.8);
        filter: blur(44px);
        opacity: 0.75;
    }

    .preview-shell {
        box-shadow: 0 1px 0 rgba(255, 255, 255, 0.9) inset,
        0 24px 60px -38px rgba(13, 13, 13, 0.32),
        0 8px 24px -18px rgba(13, 13, 13, 0.14);
    }

    .live-dot {
        animation: live-pulse 2.4s ease-in-out infinite;
    }

    @keyframes live-pulse {
        0%, 100% {
            opacity: 0.25;
            transform: scale(0.75);
        }
        50% {
            opacity: 0.8;
            transform: scale(1.25);
        }
    }
</style>
