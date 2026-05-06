import { BASE_URL } from './client'

export const submitForm = async (
    slug: string,
    form_id: string,
    data: Record<string, string>
): Promise<void> => {
    const res = await fetch(`${BASE_URL}/api/moments/${slug}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id, data }),
    })
    if (!res.ok) throw new Error(`Failed to submit form: ${res.status}`)
}
