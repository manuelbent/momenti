import { API_URL, authHeaders } from './client'
import { isRecord, readStream, type StreamEvent } from './stream'

export type MomentGenerationEvent = { type: 'open' } | StreamEvent<Moment>

const isContent = (data: unknown): data is MomentContent =>
    isRecord(data) && typeof data.slug === 'string' && isRecord(data.root) &&
    typeof data.root.id === 'string' && typeof data.root.type === 'string'

const isMoment = (data: unknown): data is Moment =>
    isRecord(data) && typeof data.id === 'number' && typeof data.slug === 'string' &&
    isContent(data.content)

const isChange = (data: unknown): data is Change =>
    isRecord(data) && typeof data.id === 'number' && typeof data.moment_id === 'number' &&
    isContent(data.new_content)

export const generateMoment = async (prompt: string, onEvent: (event: MomentGenerationEvent) => void): Promise<void> => {
    const res = await fetch(`${API_URL}/moments`, {
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

    onEvent({ type: 'open' })
    await readStream(res.body, isMoment, onEvent)
}

export const resumeMoment = async (onEvent: (event: MomentGenerationEvent) => void): Promise<void> => {
    const res = await fetch(`${API_URL}/generations`, {
        headers: authHeaders(),
    })
    if (!res.ok) throw new Error(`Failed to resume generation: ${res.status}`)
    if (!res.body) throw new Error(`Unexpected response: ${res.status}`)

    onEvent({ type: 'open' })
    await readStream(res.body, isMoment, onEvent)
}

export const patch = async (
    {
        momentId,
        nodeId,
        prompt,
        content,
        onEvent,
    }: {
        momentId: number,
        prompt: string,
        content: MomentContent,
        nodeId?: string,
        onEvent: (event: StreamEvent<Change>) => void,
    }): Promise<void> => {
    const res = await fetch(`${API_URL}/moments/${momentId}`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ nodeId, prompt, content }),
    })

    if (res.status === 403) {
        throw new Error('Forbidden: changes limit reached.')
    }

    if (!res.ok) {
        const body = await res.text()
        throw new Error(body)
    }

    if (!res.body) {
        throw new Error(`Unexpected response: ${res.status}`)
    }

    await readStream(res.body, isChange, onEvent)
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
    if (!res.ok) {
        const body: unknown = await res.json()
        if (typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string') {
            throw new Error(body.error)
        }
        throw new Error(`Failed to update moment: ${res.status}`)
    }
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
