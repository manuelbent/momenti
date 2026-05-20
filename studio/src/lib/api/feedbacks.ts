import { API_URL, authHeaders } from './client'

export const submitFeedback = async (body: FeedbackBody): Promise<void> => {
    const res = await fetch(`${API_URL}/feedbacks`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(body),
    })
    if (!res.ok) {
        throw new Error(`Failed to submit feedback: ${res.status}`)
    }
}
