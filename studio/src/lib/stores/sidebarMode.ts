import { writable } from 'svelte/store'

export type SidebarTab = 'settings' | 'changes' | 'moments'

/** Which sidebar tab is currently active in the studio. */
export const sidebarMode = writable<SidebarTab>('settings')

