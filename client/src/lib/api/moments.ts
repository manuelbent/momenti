export const capture = async (prompt: string, callbacks: CaptureCallbacks): Promise<void> => {
    const response = await fetch('http://localhost:3000/api/capture', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-invite-key': localStorage.getItem('momenti__invite_key') ?? ''
        },
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
    if (!event || !data) {
        return
    }

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
