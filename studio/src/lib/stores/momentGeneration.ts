import { writable } from 'svelte/store'
import { push } from 'svelte-spa-router'
import { capture } from '$lib/api/moments'
import { moment } from '$lib/stores/moment'
import { showToast } from '$lib/stores/toast'

export type GenerationStage = 'form'|'empty'|'preview'

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

    const openStudio = (data: Moment) => {
        moment.set(data)
        setTimeout(() => push('/studio'), 450)
    }

    const showError = (error: unknown) => {
        showToast(
            error instanceof Error ? error.message : 'Something went wrong. Please try again.',
            'error',
        )
    }

    const captureMoment = async (prompt: string) => {
        const trimmedPrompt = prompt.trim()
        if (!trimmedPrompt) return

        update(state => ({
            ...state,
            streamText: '',
            stage: 'empty',
            progressStage: 'preparing',
        }))

        try {
            await capture(trimmedPrompt, {
                onOpen: () => {
                    update(state => ({ ...state, stage: 'preview' }))
                },
                onProgress: ({ stage: progressStage }) => {
                    update(state => ({ ...state, progressStage }))
                },
                onChunk: (chunk) => {
                    update(state => ({
                        ...state,
                        streamText: state.streamText + chunk,
                    }))
                },
                onError: (error) => {
                    throw error
                },
                onDone: openStudio,
            })
        } catch (error) {
            update(state => ({ ...state, stage: 'form', progressStage: undefined }))
            showError(error)
        }
    }

    return {
        subscribe,
        capture: captureMoment,
    }
}
