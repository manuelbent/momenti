export interface CaptureCallbacks {
    onChunk: (chunk: string) => void
    onDone: (data: Moment) => void
    onError?: (err: Error) => void
}

export async function capture(prompt: string, callbacks: CaptureCallbacks): Promise<void> {
    const response = await fetch('http://localhost:3000/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

function handleMessage(message: string, callbacks: CaptureCallbacks): void {
    const event = extract(message, /^event:\s*(\w+)/m)
    const data = extract(message, /^data:\s*(.+)/ms, JSON.parse)

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

function extract<T>(text: string, regex: RegExp, transform: (v: string) => T = (v) => v as unknown as T): T|null {
    const match = text.match(regex)
    return match ? transform(match[1]) : null
}
