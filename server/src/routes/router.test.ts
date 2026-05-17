import { describe, it, expect, beforeAll } from 'vitest'
import express from 'express'
import request from 'supertest'
import RateLimitMiddleware from '../middlewares/RateLimitMiddleware'

describe('POST /invite-keys/validate', () => {
    let app: express.Express
    let middleware: RateLimitMiddleware

    beforeAll(() => {
        app = express()
        app.use(express.json())

        middleware = new RateLimitMiddleware({
            windowMs: 10000, // 10 seconds window
            limit: 3,
            dbPath: ':memory:'
        })

        // Mirroring your router configuration syntax
        app.post('/invite-keys/validate',
            (req, res, next) => middleware.handle(req, res, next),
            (req, res) => res.status(200).json({ success: true })
        )
    })

    it('should allow 3 requests and block a 4th one', async () => {
        // first 3 requests: allowed
        for (let i = 3; i >= 1; i--) {
            const response = await request(app).post('/invite-keys/validate').send({})
            expect(response.status).toBe(200)
        }

        // 4th request: blocked
        const blocked = await request(app).post('/invite-keys/validate').send({})
        expect(blocked.status).toBe(429)
        expect(blocked.body).toEqual({ error: 'Too many requests. Please try again later.' })
    })
})

describe('POST /images', () => {
    let app: express.Express
    let middleware: RateLimitMiddleware

    beforeAll(() => {
        app = express()
        app.use(express.json())

        middleware = new RateLimitMiddleware({
            windowMs: 10000, // 10 seconds window
            limit: 3,
            dbPath: ':memory:'
        })

        // Mirroring your router configuration syntax
        app.post('/images',
            (req, res, next) => middleware.handle(req, res, next),
            (req, res) => res.status(200).json({ success: true })
        )
    })

    it('should allow 3 requests and block a 4th one', async () => {
        // first 3 requests: allowed
        for (let i = 3; i >= 1; i--) {
            const response = await request(app).post('/images').send({})
            expect(response.status).toBe(200)
        }

        // 4th request: blocked
        const blocked = await request(app).post('/images').send({})
        expect(blocked.status).toBe(429)
        expect(blocked.body).toEqual({ error: 'Too many requests. Please try again later.' })
    })
})

describe('POST /moments/:slug/submissions', () => {
    let app: express.Express
    let middleware: RateLimitMiddleware

    beforeAll(() => {
        app = express()
        app.use(express.json())

        middleware = new RateLimitMiddleware({
            windowMs: 10000, // 10 seconds window
            limit: 3,
            dbPath: ':memory:'
        })

        // Mirroring your router configuration syntax
        app.post('/moments/:slug/submissions',
            (req, res, next) => middleware.handle(req, res, next),
            (req, res) => res.status(200).json({ success: true })
        )
    })

    it('should allow 3 requests and block a 4th one', async () => {
        // first 3 requests: allowed
        for (let i = 3; i >= 1; i--) {
            const response = await request(app).post('/moments/:slug/submissions').send({})
            expect(response.status).toBe(200)
        }

        // 4th request: blocked
        const blocked = await request(app).post('/moments/:slug/submissions').send({})
        expect(blocked.status).toBe(429)
        expect(blocked.body).toEqual({ error: 'Too many requests. Please try again later.' })
    })
})
