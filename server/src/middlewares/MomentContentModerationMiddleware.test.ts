import { describe, expect, it, vi } from 'vitest'
import { NextFunction, Request, Response } from 'express'
import LLMServiceInterface from '../interfaces/LLMServiceInterface'
import MomentContentModerationMiddleware from './MomentContentModerationMiddleware'

const makeRes = () => {
    const res = { status: vi.fn(), json: vi.fn() }
    res.status.mockReturnValue(res)
    return res
}

describe('MomentContentModerationMiddleware', () => {
    it('blocks flagged text content', async () => {
        const llmService = { moderateText: vi.fn().mockResolvedValue(true) } as unknown as LLMServiceInterface
        const middleware = new MomentContentModerationMiddleware(llmService)
        const req = {
            body: {
                content: {
                    root: { id: 'text', type: 'text', html: '<p>Harmful text</p>' },
                },
            },
        } as Request
        const res = makeRes()
        const next = vi.fn() as NextFunction

        await middleware.handle(req, res as unknown as Response, next)

        expect(llmService.moderateText).toHaveBeenCalledWith('Harmful text')
        expect(res.status).toHaveBeenCalledWith(422)
        expect(next).not.toHaveBeenCalled()
    })
})
