import { get, writable } from 'svelte/store'
import { push } from 'svelte-spa-router'
import { capture, resume } from '$lib/api/moments'
import { moment } from '$lib/stores/moment'
import { showToast } from '$lib/stores/toast'

export type GenerationStage = 'form'|'empty'|'resizing'|'preview'

interface MomentGenerationState {
    streamText: string
    loading: boolean
    stage: GenerationStage
}

const wait = (duration: number) => new Promise(resolve => setTimeout(resolve, duration))

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

    const showStreamingPreview = async () => {
        const steps = [
            ['empty', 450],
            ['resizing', 700],
        ] as const

        for (const [nextStage, duration] of steps) {
            update(state => ({ ...state, stage: nextStage }))
            await wait(duration)
            if (get(store).stage !== nextStage) return
        }
        update(state => ({ ...state, stage: 'preview' }))
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
                        streamText: state.streamText + chunk,
                    }))
                },
                onDone: openStudio,
            })
        } catch (error) {
            update(state => ({ ...state, loading: false }))
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
        }))

        try {
            await capture(trimmedPrompt, {
                onChunk: (chunk) => {
                    if (get(store).stage === 'empty') {
                        void showStreamingPreview()
                    }
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
            update(state => ({ ...state, stage: 'form' }))
            showError(error)
        }
    }

    return {
        subscribe,
        resume: resumeCapture,
        capture: captureMoment,
    }
}
