import { writable } from 'svelte/store'

interface Toast {
    message: string
    type: 'success' | 'error' | 'info'
}

export const toast = writable<Toast | null>(null)

let timer: ReturnType<typeof setTimeout>

export const showToast = (message: string, type: Toast['type'] = 'success', duration = 3500) => {
    clearTimeout(timer)
    toast.set({ message, type })
    timer = setTimeout(() => toast.set(null), duration)
}
