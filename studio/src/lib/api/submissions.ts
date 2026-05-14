import { authHeaders, API_URL } from './client'

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
