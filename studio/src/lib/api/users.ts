import { API_URL, authHeaders } from './client'

export const getMe = async (): Promise<{ id: number, isGenerating: boolean }> => {
    const res = await fetch(`${API_URL}/me`, {
        headers: authHeaders(),
    })
    if (!res.ok) throw new Error(`Failed to fetch current user: ${res.status}`)
    return res.json()
}
