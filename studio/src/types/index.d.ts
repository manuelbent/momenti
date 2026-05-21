interface CaptureCallbacks {
    onChunk: (chunk: string) => void
    onDone: (data: Moment) => void
    onError?: (err: Error) => void
    onIdle?: () => void
}

type FeedbackType = 'suggestion'|'bug'|'other'

interface FeedbackBody {
    type: FeedbackType
    message: string
}
