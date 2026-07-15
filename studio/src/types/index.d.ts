interface CaptureCallbacks {
    onChunk: (chunk: string) => void
    onDone: (data: Moment) => void
    onError?: (err: Error) => void
    onIdle?: () => void
}

interface PatchCallbacks {
    onChunk: (chunk: string) => void
    onDone: (data: Change) => void
    onError?: (err: Error) => void
}

interface Change {
    id: number
    moment_id: number
    node_id: string | null
    prompt: string
    old_content?: MomentContent
    new_content: MomentContent
    created_at: string
}

type FeedbackType = 'suggestion'|'bug'|'other'

interface FeedbackBody {
    type: FeedbackType
    message: string
}
