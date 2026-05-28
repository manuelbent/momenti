import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const { version } = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default defineConfig({
    define: {
        __APP_VERSION__: JSON.stringify(version),
    },
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
