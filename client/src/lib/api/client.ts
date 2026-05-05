import { get } from 'svelte/store'
import { inviteKey } from '$lib/stores/auth'

export const BASE_URL = 'http://localhost:3000'

export function authHeaders(): HeadersInit {
    return {
        'Content-Type': 'application/json',
        'x-invite-key': get(inviteKey)
    }
}

