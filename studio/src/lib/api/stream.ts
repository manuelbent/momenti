export type StreamEvent<T> =
    | { type: 'progress'; stage: CaptureProgressStage }
    | { type: 'chunk'; chunk: string }
    | { type: 'done'; data: T }
    | { type: 'error'; error: Error }

const progressStages = new Set<string>([
    'preparing', 'moderating', 'classifying', 'planning-image',
    'generating-image', 'uploading-image', 'generating-moment',
])

const isProgressStage = (value: unknown): value is CaptureProgressStage =>
    typeof value === 'string' && progressStages.has(value)

export const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value)

const decodeEvent = <T>(
    event: string,
    text: string,
    isDone: (value: unknown) => value is T,
): StreamEvent<T> | undefined => {
    if (!['progress', 'chunk', 'done', 'error'].includes(event)) return

    const data: unknown = JSON.parse(text)
    if (event === 'done' && isDone(data)) return { type: 'done', data }
    if (isRecord(data)) {
        if (event === 'progress' && isProgressStage(data.stage)) {
            return { type: 'progress', stage: data.stage }
        }
        if (event === 'chunk' && typeof data.chunk === 'string') {
            return { type: 'chunk', chunk: data.chunk }
        }
        if (event === 'error' && typeof data.error === 'string' && data.error.trim()) {
            return { type: 'error', error: new Error(data.error) }
        }
    }
    throw new Error(`Invalid generation event: ${event}`)
}

export const readStream = async <T>(
    body: ReadableStream<Uint8Array>,
    isDone: (value: unknown) => value is T,
    onEvent: (event: StreamEvent<T>) => void,
): Promise<void> => {
    const reader = body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let event = ''
    let data: string[] = []

    try {
        while (true) {
            const { value, done } = await reader.read()
            if (done) throw new Error('The connection closed before generation completed. Please try again.')
            buffer += decoder.decode(value, { stream: true })

            let end: number
            while ((end = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, end).replace(/\r$/, '')
                buffer = buffer.slice(end + 1)
                if (!line) {
                    if (event) {
                        const message = decodeEvent(event, data.join('\n'), isDone)
                        if (message) {
                            onEvent(message)
                            if (message.type === 'done' || message.type === 'error') return
                        }
                    }
                    event = ''
                    data = []
                    continue
                }
                const colon = line.indexOf(':')
                const field = colon === -1 ? line : line.slice(0, colon)
                const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '')
                if (field === 'event') event = value
                if (field === 'data') data.push(value)
            }
        }
    } finally {
        try {
            await reader.cancel()
        } finally {
            reader.releaseLock()
        }
    }
}
