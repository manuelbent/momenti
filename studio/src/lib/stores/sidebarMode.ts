import { writable } from 'svelte/store'

export type SidebarTab = 'editor' | 'changes' | 'moments'

/** Which sidebar tab is currently active in the studio. */
export const sidebarMode = writable<SidebarTab>('moments')
