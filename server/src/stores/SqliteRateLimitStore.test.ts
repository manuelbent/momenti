import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Options } from 'express-rate-limit'
import SqliteRateLimitStore from './SqliteRateLimitStore'

describe('SqliteRateLimitStore', () => {
    let store: SqliteRateLimitStore

    beforeEach(async () => {
        store = new SqliteRateLimitStore(':memory:')
        await store.init({ windowMs: 60_000 } as Options)
    })

    it('returns totalHits of 1 on the first increment', async () => {
        const result = await store.increment('test-key')
        expect(result.totalHits).toBe(1)
    })

    it('accumulates hits across multiple increments on the same key', async () => {
        await store.increment('test-key')
        await store.increment('test-key')
        const result = await store.increment('test-key')
        expect(result.totalHits).toBe(3)
    })

    it('tracks different keys independently', async () => {
        await store.increment('key-a')
        await store.increment('key-a')
        const result = await store.increment('key-b')
        expect(result.totalHits).toBe(1)
    })

    it('decrement reduces the hit count', async () => {
        await store.increment('test-key')
        await store.increment('test-key')
        await store.decrement('test-key')
        const result = await store.increment('test-key')
        expect(result.totalHits).toBe(2)
    })

    it('decrement does not go below zero', async () => {
        await store.increment('test-key')
        await store.decrement('test-key')
        await store.decrement('test-key')
        const result = await store.increment('test-key')
        expect(result.totalHits).toBe(1)
    })

    it('resetKey clears the counter so the next increment returns 1', async () => {
        await store.increment('test-key')
        await store.increment('test-key')
        await store.resetKey('test-key')
        const result = await store.increment('test-key')
        expect(result.totalHits).toBe(1)
    })

    it('resets the counter after the window expires', async () => {
        store = new SqliteRateLimitStore(':memory:')
        await store.init({ windowMs: 60_000 } as Options)

        await store.increment('test-key')
        await store.increment('test-key')

        vi.useFakeTimers()
        vi.advanceTimersByTime(60_001) // move past the window

        const result = await store.increment('test-key')

        vi.useRealTimers()
        expect(result.totalHits).toBe(1)
    })

    it('resetTime is a Date roughly one window into the future', async () => {
        const before = Date.now()
        const { resetTime } = await store.increment('test-key')
        const after = Date.now()

        expect(resetTime).toBeInstanceOf(Date)
        expect(resetTime!.getTime()).toBeGreaterThanOrEqual(before + 60_000)
        expect(resetTime!.getTime()).toBeLessThanOrEqual(after + 60_000)
    })
})
