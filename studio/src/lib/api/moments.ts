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

    await readStream<Moment>(res.body, callbacks)
}

export const resume = async (callbacks: CaptureCallbacks): Promise<void> => {
    const res = await fetch(`${API_URL}/capture/resume`, {
        headers: authHeaders(),
    })

    if (!res.ok || !res.body) return

    await readStream<Moment>(res.body, callbacks)
}

const readStream = async <T>(
    body: ReadableStream<Uint8Array>,
    callbacks: {
        onChunk: (chunk: string) => void
        onDone: (data: T) => void
        onError?: (err: Error) => void
        onIdle?: () => void
    }
): Promise<void> => {
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
            let event: string | undefined
            let data: unknown

            for (const line of msg.split('\n')) {
                if (line.startsWith('event:')) event = line.slice('event:'.length).trim()
                else if (line.startsWith('data:')) data = JSON.parse(line.slice('data:'.length).trim())
            }

            if (!event || data === undefined) continue

            switch (event) {
                case 'idle':
                    callbacks.onIdle?.()
                    return
                case 'chunk':
                    callbacks.onChunk((data as { chunk: string }).chunk)
                    break
                case 'done':
                    callbacks.onDone(data as T)
                    return
                case 'error':
                    throw new Error((data as { error: string }).error)
            }
        }
    }
}

export const patch = async (
    {
        momentId,
        nodeId,
        prompt,
        content,
        callbacks,
    }: {
        momentId: number,
        nodeId: string,
        prompt: string,
        content: MomentContent,
        callbacks: PatchCallbacks,
    }): Promise<void> => {
    const res = await fetch(`${API_URL}/moments/${momentId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ nodeId, prompt, content }),
    })

    if (!res.ok) {
        const body = await res.text()
        throw new Error(`Unexpected response: ${body} ${res.status}`)
    }

    if (!res.body) {
        throw new Error(`Unexpected response: ${res.status}`)
    }

    await readStream<MomentContent>(res.body, callbacks)
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

export const checkSlugAvailability = async (slug: string, excludedId: number): Promise<boolean> => {
    const query = new URLSearchParams({ slug, excludedId: String(excludedId) }).toString()
    const res = await fetch(`${API_URL}/moments/check-slug?${query}`, {
        headers: authHeaders()
    })
    if (!res.ok) throw new Error(`Failed to check slug availability: ${res.status}`)
    const { isAvailable } = await res.json()
    return isAvailable
}

export const getChanges = async (momentId: number): Promise<Change[]> => {
    const res = await fetch(`${API_URL}/moments/${momentId}/changes`, {
        headers: authHeaders(),
    })
    if (!res.ok) throw new Error(`Failed to fetch changes: ${res.status}`)
    return res.json()
}

