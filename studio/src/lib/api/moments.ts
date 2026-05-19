import { API_URL, authHeaders } from './client'

export const capture = async (prompt: string, callbacks: CaptureCallbacks): Promise<void> => {
    const res = await fetch(`${API_URL}/capture`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ prompt }),
    })

    if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error ?? `Unexpected response: ${res.status}`)
    }

    if (!res.body) {
        throw new Error(`Unexpected response: ${res.status}`)
    }

    await readStream(res.body, callbacks)
}

export const resume = async (callbacks: CaptureCallbacks): Promise<void> => {
    const res = await fetch(`${API_URL}/capture/resume`, {
        headers: authHeaders(),
    })

    if (!res.ok || !res.body) return

    await readStream(res.body, callbacks)
}

const readStream = async (body: ReadableStream<Uint8Array>, callbacks: CaptureCallbacks): Promise<void> => {
    const reader = body
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
            if (handleMessage(msg, callbacks) === 'idle') return
        }
    }
}

const handleMessage = (message: string, callbacks: CaptureCallbacks): 'idle' | void => {
    let event: string | undefined
    let data: unknown

    for (const line of message.split('\n')) {
        if (line.startsWith('event:')) {
            event = line.slice('event:'.length).trim()
        } else if (line.startsWith('data:')) {
            data = JSON.parse(line.slice('data:'.length).trim())
        }
    }

    if (!event || data === undefined) return

    switch (event) {
        case 'idle':
            callbacks.onIdle?.()
            return 'idle'
        case 'chunk':
            callbacks.onChunk((data as { chunk: string }).chunk)
            break
        case 'done':
            callbacks.onDone(data as Moment)
            break
        case 'error':
            throw new Error((data as { error: string }).error)
    }
}

export const getMomentBySlug = async (slug: string): Promise<Moment|null> => {
    const res = await fetch(`${API_URL}/moments/${slug}`, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    if (!res.ok) throw new Error(`Failed to fetch moment: ${res.status}`)
    return res.json()
}

export const getMoments = async (): Promise<Moment[]> => {
    const res = await fetch(`${API_URL}/moments`, {
        headers: authHeaders(),
    })
    if (!res.ok) throw new Error(`Failed to fetch moments: ${res.status}`)
    return res.json()
}

export const updateMoment = async (id: number, data: Partial<Moment>): Promise<Moment> => {
    const res = await fetch(`${API_URL}/moments/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error(`Failed to update moment: ${res.status}`)
    return res.json()
}
