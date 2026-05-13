import { authHeaders, API_URL } from './client'

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

export const downloadFormSubmissions = async (slug: string) => {
    const res = await fetch(`${API_URL}/moments/${slug}/submissions`, {
        method: 'GET',
        headers: {
            ...authHeaders(),
            'Accept': 'text/csv',
        },
    })
    if (res.status === 204) return  // no submissions
    if (!res.ok) throw new Error(`Failed to download submissions: ${res.status}`)

    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${slug}-responses.csv`
    a.click()
    URL.revokeObjectURL(url)
}
