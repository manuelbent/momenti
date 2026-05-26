// shared types are defined in shared/types.d.ts and included via tsconfig

interface StreamEvent {
    event: 'chunk' | 'done' | 'error'
    data: unknown
}
