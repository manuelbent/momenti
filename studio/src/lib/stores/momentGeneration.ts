import { get, writable } from 'svelte/store'
import { push } from 'svelte-spa-router'
import { capture, type CaptureEvent } from '$lib/api/moments'
import { moment } from '$lib/stores/moment'
import { showToast } from '$lib/stores/toast'

export type GenerationStage = 'form'|'connecting'|'preview'

interface MomentGenerationState {
    streamText: string
    stage: GenerationStage
    progressStage?: CaptureProgressStage
}

export const createMomentGenerationStore = () => {
    const store = writable<MomentGenerationState>({
        streamText: '',
        stage: 'form',
    })
    const { subscribe, update } = store

    const onEvent = (event: CaptureEvent) => {
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
                setTimeout(() => push('/studio'), 450)
                break
            case 'error':
                throw event.error
        }
    }

    const captureMoment = async (prompt: string) => {
        const trimmedPrompt = prompt.trim()
        if (!trimmedPrompt || get(store).stage !== 'form') return

        store.set({
            streamText: '',
            stage: 'connecting',
            progressStage: 'preparing',
        })

        try {
            await capture(trimmedPrompt, onEvent)
        } catch (error) {
            store.set({ streamText: '', stage: 'form' })
            showToast(
                error instanceof Error ? error.message : 'Something went wrong. Please try again.',
                'error',
            )
        }
    }

    return {
        subscribe,
        capture: captureMoment,
    }
}
