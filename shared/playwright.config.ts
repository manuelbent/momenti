import { defineConfig } from '@playwright/test'

export default defineConfig({
    testDir: './tests',
    use: { browserName: 'chromium', headless: true },
    webServer: [
        {
            command: 'npm --prefix ../studio run build && npm --prefix ../studio run preview -- --host 127.0.0.1 --port 4173 --strictPort',
            timeout: 120_000,
            url: 'http://127.0.0.1:4173',
            env: { VITE_MOMENTI_API_URL: 'http://127.0.0.1:4173/api' },
        },
        {
            command: 'npm --prefix ../viewer run build && npm --prefix ../viewer run preview -- --host 127.0.0.1 --port 4174 --strictPort',
            timeout: 120_000,
            url: 'http://127.0.0.1:4174',
            env: { VITE_MOMENTI_API_URL: 'http://127.0.0.1:4174/api' },
        },
    ],
})
