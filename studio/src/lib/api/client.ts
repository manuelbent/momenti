import { get } from 'svelte/store'
import { inviteKey } from '$lib/stores/auth'

export const API_URL = import.meta.env.VITE_MOMENTI_API_URL

export function authHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'x-invite-key': get(inviteKey)
    }
}
