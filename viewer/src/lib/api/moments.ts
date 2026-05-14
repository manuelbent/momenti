export const API_URL = import.meta.env.VITE_MOMENTI_API_URL

export const getMomentBySlug = async (slug: string): Promise<Moment|null> => {
    const res = await fetch(`${API_URL}/moments/${slug}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!res.ok) throw new Error(`Failed to fetch moment: ${res.status}`)
    return res.json()
}

export const submitForm = async (
    slug: string,
    form_id: string,
    data: Record<string, string>
): Promise<void> => {
    const res = await fetch(`${API_URL}/moments/${slug}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id, data }),
    })
    if (!res.ok) throw new Error(`Failed to submit form: ${res.status}`)
}
