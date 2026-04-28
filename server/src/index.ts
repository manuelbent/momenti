import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import generateRouter from './routes/generate'

// ── App ───────────────────────────────────────────────────────────────────────
const app = express()

app.use(cors({ origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173' }))
app.use(express.json())

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/generate', generateRouter)

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000
app.listen(PORT, () => {
    console.log(`🚀 Momenti server running on http://localhost:${PORT}`)
})
