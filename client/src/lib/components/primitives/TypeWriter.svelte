<script lang="ts">
    import { onMount, onDestroy } from 'svelte'

    interface Props {
        words: string[]
        pauseMs?: number
        backspeedMs?: number
        typespeedMs?: number
    }

    let { words, pauseMs = 1000, backspeedMs = 65, typespeedMs = 95 }: Props = $props()

    let cycleIndex = 0
    const initial = words[0] ?? ''
    let displayed = $state<string>(initial)
    let typeTimeout: ReturnType<typeof setTimeout> | undefined

    function runTyper() {
        const current = words[cycleIndex]
        const next    = words[(cycleIndex + 1) % words.length]
        let step = current.length

        function backspace() {
            step--
            displayed = current.slice(0, step)
            if (step > 0) {
                typeTimeout = setTimeout(backspace, backspeedMs)
            } else {
                cycleIndex = (cycleIndex + 1) % words.length
                let i = 0
                typeTimeout = setTimeout(function typeChar() {
                    i++
                    displayed = next.slice(0, i)
                    typeTimeout = i < next.length
                        ? setTimeout(typeChar, typespeedMs)
                        : setTimeout(runTyper, pauseMs)
                }, 140)
            }
        }

        typeTimeout = setTimeout(backspace, pauseMs)
    }

    onMount(() => { typeTimeout = setTimeout(runTyper, pauseMs) })
    onDestroy(() => { clearTimeout(typeTimeout) })
</script>

<span class="text-[#9d174d]">{displayed}</span><span class="cursor">|</span>

<style>
    .cursor {
        font-weight: 200;
        animation: blink 1.1s step-start infinite;
    }
    @keyframes blink {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0; }
    }
</style>



