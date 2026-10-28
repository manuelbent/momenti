import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import StreamCache from './StreamCache'

describe('StreamCache', () => {
    beforeEach(() => vi.useFakeTimers())
    afterEach(() => vi.useRealTimers())

    it('tracks active generations independently and clears them on completion', () => {
        const cache = new StreamCache()

        expect(cache.isGenerating(1)).toBe(false)
        cache.init(1)
        cache.init(2)
        expect(cache.isGenerating(1)).toBe(true)
        expect(cache.isGenerating(2)).toBe(true)

        cache.clear(1)
        expect(cache.isGenerating(1)).toBe(false)
        expect(cache.isGenerating(2)).toBe(true)
        cache.clear(2)
        expect(vi.getTimerCount()).toBe(0)
    })

    it('expires active generation entries at the configured TTL', () => {
        const cache = new StreamCache(1000)
        cache.init(1)

        vi.advanceTimersByTime(999)
        expect(cache.isGenerating(1)).toBe(true)
        vi.advanceTimersByTime(1)
        expect(cache.isGenerating(1)).toBe(false)
    })

    it('replaces an existing entry and cancels its old expiry timer', () => {
        const cache = new StreamCache(1000)
        cache.init(1)
        vi.advanceTimersByTime(500)
        cache.init(1)

        expect(vi.getTimerCount()).toBe(1)
        vi.advanceTimersByTime(500)
        expect(cache.isGenerating(1)).toBe(true)
        vi.advanceTimersByTime(500)
        expect(cache.isGenerating(1)).toBe(false)
    })
})
