import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import express, { NextFunction, Request, Response } from 'express'
import { vi } from 'vitest'
import RedisMock from 'ioredis-mock'
import { RateLimiterRedis } from 'rate-limiter-flexible'
import RateLimiterMiddleware from '../middlewares/RateLimiterMiddleware'

// use in-memory redis mock
vi.mock('../config/redis', () => ({ default: new RedisMock() }))

const LIMIT = 3

function buildApp() {
    // init the middleware with a test limiter instance
    const rateLimiterMiddleware = new RateLimiterMiddleware(new RateLimiterRedis({
        storeClient: new RedisMock(),
        keyPrefix: 'test:rl',
        points: LIMIT,
        duration: 60,
    }))

    const app = express()

    app.enable('trust proxy')

    app.use(express.json())

    app.post('/invite-keys/validate',
        (req: Request, res: Response, next: NextFunction) => rateLimiterMiddleware.handle(req, res, next),
        (_req: Request, res: Response) => res.sendStatus(200),
    )

    return app
}

describe('POST /invite-keys/validate', () => {
    let app: ReturnType<typeof buildApp>

    beforeEach(() => { app = buildApp() })

    it(`allows the first ${LIMIT} requests and blocks the ${LIMIT + 1}th`, async () => {
        for (let i = 0; i < LIMIT; i++) {
            const res = await request(app).post('/invite-keys/validate')
            expect(res.status).toBe(200)
        }

        const blocked = await request(app).post('/invite-keys/validate')
        expect(blocked.status).toBe(429)
        expect(blocked.headers['retry-after']).toBeDefined()
        expect(blocked.body.error).toBe('Too many requests. Please try again later.')
    })

    it('serves different IPs independently', async () => {
        // Exhaust the limit for IP A
        for (let i = 0; i < LIMIT; i++) {
            await request(app).post('/invite-keys/validate').set('X-Forwarded-For', '1.1.1.1')
        }

        // IP A is blocked
        const blockedA = await request(app).post('/invite-keys/validate').set('X-Forwarded-For', '1.1.1.1')
        expect(blockedA.status).toBe(429)

        // IP B still has its own fresh quota
        const allowedB = await request(app).post('/invite-keys/validate').set('X-Forwarded-For', '2.2.2.2')
        expect(allowedB.status).toBe(200)
    })
})
