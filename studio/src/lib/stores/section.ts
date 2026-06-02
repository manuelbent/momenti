import { writable } from 'svelte/store'

// the currently selected promptable section
export const selectedSection = writable<MomentNode | null>(null)

// the state of the patching process for the currently selected section
export const patchState = writable<'idle' | 'streaming' | 'done' | 'error'>('idle')

// the current chunk of the patch being streamed in for the currently selected section
export const patchChunk = writable<string>('')
