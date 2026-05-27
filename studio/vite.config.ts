import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
    plugins: [tailwindcss(), svelte()],
    server: {
        port: 5173,
    },
    resolve: {
        alias: {
            '$lib': resolve('./src/lib'),
            '$shared': resolve('../shared')
        }
    }
})
