import { BASE_URL, authHeaders } from './client'

export const capture = async (prompt: string, callbacks: CaptureCallbacks): Promise<void> => {
    const response = await fetch(`${BASE_URL}/api/capture`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ prompt }),
    })

    if (!response.ok || !response.body) {
        throw new Error(`Unexpected response: ${response.status}`)
    }

    const reader = response.body
        .pipeThrough(new TextDecoderStream() as unknown as ReadableWritablePair<string, Uint8Array>)
        .getReader()

    let buffer = ''

    while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += value
        const messages = buffer.split('\n\n')
        buffer = messages.pop() ?? ''

        for (const msg of messages) {
            handleMessage(msg, callbacks)
        }
    }
}

const handleMessage = (message: string, callbacks: CaptureCallbacks) => {
    const { event, data } = JSON.parse(message)
    if (!event || !data) return

    switch (event) {
        case 'chunk':
            callbacks.onChunk(data.chunk)
            break
        case 'done':
            callbacks.onDone(data)
            break
        case 'error':
            throw new Error(data.error)
    }
}

export const getMoments = async (): Promise<Moment[]> => {
    const res = await fetch(`${BASE_URL}/api/moments`, {
        headers: authHeaders(),
    })
    if (!res.ok) throw new Error(`Failed to fetch moments: ${res.status}`)
    return res.json()
}

export const updateMoment = async (id: number, data: Partial<Moment>): Promise<Moment> => {
    const res = await fetch(`${BASE_URL}/api/moments/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`Failed to update moment: ${res.status}`)
    return res.json()
}

export const checkSlug = async (slug: string, excludeId: number): Promise<{ isAvailable: boolean }> => {
    const params = new URLSearchParams({ slug, excludeId: String(excludeId) })
    const res = await fetch(`${BASE_URL}/api/moments/check-slug?${params}`, {
        headers: authHeaders(),
    })
    if (!res.ok) throw new Error(`Failed to check slug: ${res.status}`)
    return res.json()
}
