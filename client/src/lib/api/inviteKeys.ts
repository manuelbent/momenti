import { BASE_URL } from './client'

export const validateInviteKey = async (invite_key: string): Promise<{ isValid: boolean }> => {
    const res = await fetch(`${BASE_URL}/api/invite-keys/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invite_key }),
    })
    if (!res.ok) throw new Error(`Failed to validate invite key: ${res.status}`)
    return res.json()
}
