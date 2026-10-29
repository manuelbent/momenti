import { get, writable } from 'svelte/store'
import { push } from 'svelte-spa-router'
import { generateMoment, resumeMoment, type MomentGenerationEvent } from '$lib/api/moments'
import { moment } from '$lib/stores/moment'
import { showToast } from '$lib/stores/toast'

export type GenerationStage = 'form'|'connecting'|'preview'

interface MomentGenerationState {
    streamText: string
    stage: GenerationStage
    progressStage?: GenerationProgressStage
}

export const createMomentGenerationStore = () => {
    const store = writable<MomentGenerationState>({
        streamText: '',
        stage: 'form',
    })
    const { subscribe, update } = store

    const onEvent = (event: MomentGenerationEvent) => {
        switch (event.type) {
            case 'open':
                update(state => ({ ...state, stage: 'preview' }))
                break
            case 'progress':
                update(state => ({ ...state, progressStage: event.stage }))
                break
            case 'chunk':
                update(state => ({ ...state, streamText: state.streamText + event.chunk }))
                break
            case 'done':
                moment.set(event.data)
                setTimeout(async () => {
                    await push('/studio')
                    store.set({ streamText: '', stage: 'form' })
                }, 450)
                break
            case 'error':
                throw event.error
        }
    }

    const start = async (request: () => Promise<void>) => {
        if (get(store).stage !== 'form') return

        store.set({
            streamText: '',
            stage: 'connecting',
            progressStage: 'preparing',
        })

        try {
            await request()
        } catch (error) {
            store.set({ streamText: '', stage: 'form' })
            showToast(
                error instanceof Error ? error.message : 'Something went wrong. Please try again.',
                'error',
            )
        }
    }

    const generate = async (prompt: string) => {
        const trimmedPrompt = prompt.trim()
        if (!trimmedPrompt) return
        await start(() => generateMoment(trimmedPrompt, onEvent))
    }

    const resume = () => start(() => resumeMoment(onEvent))

    return {
        subscribe,
        generate,
        resume,
    }
}

export const momentGeneration = createMomentGenerationStore()
