// Shared types (FormField, MomentNode, Content, Moment, CssComputedVals)
// are defined in shared/types.d.ts and included via tsconfig.

interface StreamEvent {
    event: 'chunk' | 'done' | 'error'
    data: unknown
}

type StreamType = 'capture' | 'patch'

type LLMStreamPayload =
    | { chunk: string }
    | { done: true; momentContent: MomentContent }
    | { error: string }

/**
 * Parameters required to patch an existing Moment.
 * Grouped into a single object so the patch pipeline stays easy to extend.
 * @interface PatchMomentParams
 */
interface PatchMomentParams {
    /** The user's change instruction (the current chat message). */
    prompt: string
    /** The full current MomentContent to patch. */
    content: MomentContent
    /** The id of the MomentNode the user selected, if any. */
    nodeId?: string
    /**
     * Ordered (oldest → newest) list of the user's previous change prompts
     * for this moment. Lets the LLM resolve vague follow-ups (e.g. "try again").
     * Only prompt strings are sent to keep token usage low.
     */
    history?: string[]
}
