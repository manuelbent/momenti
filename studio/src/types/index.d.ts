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
