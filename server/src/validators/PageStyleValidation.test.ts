import express from 'express'
import request from 'supertest'
import { describe, expect, it, vi } from 'vitest'
import type MomentServiceInterface from '../interfaces/MomentServiceInterface'
import PatchMomentRequestValidator from './PatchMomentRequestValidator'
import UpdateMomentRequestValidator from './UpdateMomentRequestValidator'
import ValidationErrorMiddleware from '../middlewares/ValidationErrorMiddleware'
import { z } from 'zod'

const service: MomentServiceInterface = {
    store: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
    getBySlug: vi.fn(),
    getPublishedBySlug: vi.fn(),
    getAll: vi.fn(),
    slugExists: vi.fn().mockResolvedValue(false),
}

function app() {
    const app = express()
    const patch = new PatchMomentRequestValidator()
    const update = new UpdateMomentRequestValidator(service)
    app.use(express.json({ limit: '1mb' }))
    app.patch('/moments/:id', patch.validate.bind(patch), (req, res) => res.json(req.body))
    app.put('/moments/:id', update.validate.bind(update), (req, res) => res.json(req.body))
    app.get('/invalid', () => { z.string().parse(42) })
    const errors = new ValidationErrorMiddleware()
    app.use(errors.handle.bind(errors))
    return app
}

const content = {
    slug: 'dinner-a1b2',
    fonts: ['DM Sans'],
    stylesheet: '#title { color: red }',
    root: { id: 'root', type: 'box' },
}

describe.each(['patch', 'put'] as const)('%s page stylesheet validation', method => {
    it('preserves stylesheet, fonts and node content', async () => {
        const response = await request(app())[method]('/moments/1')
            .send({ content, ...(method === 'patch' ? { prompt: 'Make the title larger' } : {}) })
        expect(response.status).toBe(200)
        expect(response.body.content).toEqual(content)
    })

    it('continues to accept legacy inline-only content', async () => {
        const { stylesheet, fonts, ...legacy } = content
        const response = await request(app())[method]('/moments/1')
            .send({ content: legacy, ...(method === 'patch' ? { prompt: 'Make the title larger' } : {}) })
        expect(response.status).toBe(200)
        expect(response.body.content).toEqual(legacy)
    })

    it.each([42, 'x'.repeat(100_001)])('rejects invalid stylesheets', async stylesheet => {
        const response = await request(app())[method]('/moments/1')
            .send({
                content: { ...content, stylesheet },
                ...(method === 'patch' ? { prompt: 'Make the title larger' } : {}),
            })
        expect(response.status).toBe(400)
        expect(response.body.error).toBeDefined()
    })
})

it('returns Zod validation details using the current API', async () => {
    const response = await request(app()).get('/invalid')
    expect(response.status).toBe(400)
    expect(response.body.details).toEqual(expect.arrayContaining([
        expect.objectContaining({ code: 'invalid_type' }),
    ]))
})
