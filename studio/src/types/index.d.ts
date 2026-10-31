interface UploadImageOptions {
    momentId: number
    file: File
}

interface PresignedUploadResponse {
    uploadId: string
    uploadUrl: string
    url: string
    headers: { 'Content-Type': string }
    expiresAt: string
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
