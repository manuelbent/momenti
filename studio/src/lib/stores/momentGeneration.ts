import { writable } from 'svelte/store'
import { push } from 'svelte-spa-router'
import { capture, resume } from '$lib/api/moments'
import { moment } from '$lib/stores/moment'
import { showToast } from '$lib/stores/toast'

export type GenerationStage = 'form'|'empty'|'preview'

interface MomentGenerationState {
    streamText: string
    loading: boolean
    stage: GenerationStage
    progressStage?: CaptureProgressStage
}

export const createMomentGenerationStore = () => {
    const store = writable<MomentGenerationState>({
        streamText: '',
        loading: true,
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

    const resumeCapture = async (hasInviteKey: boolean) => {
        if (!hasInviteKey) {
            update(state => ({ ...state, loading: false }))
            return
        }

        try {
            await resume({
                onIdle: () => {
                    update(state => ({ ...state, loading: false }))
                },
                onChunk: (chunk) => {
                    update(state => ({
                        ...state,
                        loading: false,
                        stage: 'preview',
                        progressStage: undefined,
                        streamText: state.streamText + chunk,
                    }))
                },
                onDone: openStudio,
            })
        } catch (error) {
            update(state => ({
                ...state,
                loading: false,
                stage: 'form',
                progressStage: undefined,
                streamText: '',
            }))
            showError(error)
        }
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
                    update(state => ({ ...state, loading: false, stage: 'preview' }))
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
        resume: resumeCapture,
        capture: captureMoment,
    }
}
