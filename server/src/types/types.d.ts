// Shared types (FormField, MomentNode, Content, Moment, CssComputedVals)
// are defined in shared/types.d.ts and included via tsconfig.

// RawMoment is kept as an alias for server-side code that references it.
type RawMoment = Content

interface StreamEvent {
    event: 'chunk' | 'done' | 'error'
    data: unknown
}
