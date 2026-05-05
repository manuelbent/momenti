import { writable } from 'svelte/store'

// overwrite writeable to add local storage functionality
const useAuthStore = () => {
    const { update, subscribe, set } = writable<string>()
    return {
        update,
        subscribe,
        set: (inviteKey: string)=> {
            try {
                localStorage.setItem('momenti__invite_key', inviteKey)
            } catch (err) {
                console.error('[Store] Could not store moment for preview.')
            }
            set(inviteKey)
        }
    }
}

export const inviteKey = useAuthStore()
