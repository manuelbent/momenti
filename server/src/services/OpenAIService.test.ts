import { beforeEach, describe, expect, it, vi } from 'vitest'
import OpenAIService from './OpenAIService'

const { complete, moderate, generate, warn } = vi.hoisted(() => ({
    complete: vi.fn(),
    moderate: vi.fn(),
    generate: vi.fn(),
    warn: vi.fn(),
}))

vi.mock('openai', () => ({
    default: class {
        chat = { completions: { create: complete } }
        moderations = { create: moderate }
        images = { generate }
    },
}))

vi.mock('../config/logger', () => ({
    default: { warn, error: vi.fn() },
}))

describe('OpenAIService', () => {
    const context: LLMRequestContext = { userId: 7, generationId: 'generation-1', momentId: 42 }
    const content = { slug: 'garden-party', root: { id: 'hero', type: 'box' } }
    let record: ReturnType<typeof vi.fn>
    let service: OpenAIService

    beforeEach(() => {
        vi.clearAllMocks()
        complete.mockReset()
        moderate.mockReset()
        generate.mockReset()
        record = vi.fn().mockResolvedValue({ cost_usd: 0.001 })
        service = new OpenAIService({ record, store: vi.fn() })
    })

    it('records classification usage before returning a plain result', async () => {
        complete.mockResolvedValue({
            id: 'chat-1',
            choices: [{ message: { content: '{"valid":true}' } }],
            usage: { prompt_tokens: 100, completion_tokens: 20 },
        })

        await expect(service.classifyPrompt('A garden party', context)).resolves.toEqual({ valid: true })
        expect(record).toHaveBeenCalledExactlyOnceWith({
            moment_id: 42,
            user_id: 7,
            generation_id: 'generation-1',
            operation: 'prompt-classification',
            model: 'gpt-6-luna',
            response_id: 'chat-1',
            input_tokens: 100,
            output_tokens: 20,
        })
    })

    it('still records a response when classification JSON is invalid', async () => {
        complete.mockResolvedValue({
            id: 'chat-1',
            choices: [{ message: { content: 'invalid' } }],
            usage: { prompt_tokens: 100, completion_tokens: 20 },
        })

        await expect(service.classifyPrompt('A garden party', context)).resolves.toEqual({
            valid: false, reason: 'Classification failed.',
        })
        expect(record).toHaveBeenCalledTimes(1)
    })

    it('returns a plain image prompt and records missing usage as null', async () => {
        complete.mockResolvedValue({
            id: 'chat-2',
            choices: [{ message: { content: ' A candlelit garden ' } }],
        })

        await expect(service.generateImagePrompt('A garden party', context)).resolves.toBe('A candlelit garden')
        expect(record).toHaveBeenCalledWith(expect.objectContaining({
            operation: 'hero-image-prompt', input_tokens: null, output_tokens: null,
        }))
    })

    it('records image prompt usage before rejecting missing content', async () => {
        complete.mockResolvedValue({
            id: 'chat-2', choices: [], usage: { prompt_tokens: 100, completion_tokens: 0 },
        })

        await expect(service.generateImagePrompt('A garden party', context))
            .rejects.toThrow('OpenAI did not return an image prompt.')
        expect(record).toHaveBeenCalledTimes(1)
    })

    it('records free moderation with unavailable counts and returns a boolean', async () => {
        moderate.mockResolvedValue({ id: 'mod-1', results: [{ flagged: true }] })

        await expect(service.moderateText('Some text', {
            userId: 7,
            momentId: 42,
            operation: 'moment-content-moderation',
        })).resolves.toBe(true)
        expect(record).toHaveBeenCalledWith({
            moment_id: 42,
            user_id: 7,
            generation_id: null,
            operation: 'moment-content-moderation',
            model: 'omni-moderation-latest',
            response_id: 'mod-1',
            input_tokens: null,
            output_tokens: null,
        })
    })

    it('preserves fail-open moderation behavior and logs unavailable API errors', async () => {
        moderate.mockRejectedValue(new Error('Unavailable'))

        await expect(service.moderateText('Some text', context)).resolves.toBe(false)
        expect(record).not.toHaveBeenCalled()
        expect(warn).toHaveBeenCalled()
    })

    it('generates images and records only total input and output tokens', async () => {
        generate.mockResolvedValue({
            data: [{ b64_json: Buffer.from('image-data').toString('base64') }],
            usage: {
                input_tokens: 150,
                output_tokens: 200,
            },
        })

        await expect(service.generateImage('A candlelit garden', context)).resolves.toEqual(Buffer.from('image-data'))
        expect(generate).toHaveBeenCalledWith({
            model: 'gpt-image-2.5-flare',
            prompt: 'A candlelit garden',
            output_format: 'png',
            quality: 'low',
            size: '1536x1024',
        })
        expect(record).toHaveBeenCalledWith({
            moment_id: 42,
            user_id: 7,
            generation_id: 'generation-1',
            operation: 'hero-image-generation',
            model: 'gpt-image-2.5-flare',
            response_id: null,
            input_tokens: 150,
            output_tokens: 200,
        })
    })

    it('records nulls for unavailable image usage before rejecting missing image data', async () => {
        generate.mockResolvedValue({ data: [] })

        await expect(service.generateImage('A candlelit garden', context))
            .rejects.toThrow('OpenAI did not return generated image data.')
        expect(record).toHaveBeenCalledWith(expect.objectContaining({
            input_tokens: null,
            output_tokens: null,
        }))
    })

    it.each(['generate', 'patch'] as const)('records %s stream usage internally before yielding done', async (operation) => {
        complete.mockResolvedValue((async function* () {
            yield { id: 'stream-1', choices: [{ delta: { content: JSON.stringify(content) } }] }
            yield { id: 'stream-1', choices: [], usage: { prompt_tokens: 100, completion_tokens: 50 } }
        })())
        const stream = operation === 'generate'
            ? service.generateMoment('A garden party', { heroImageUrl: 'https://example.com/image.png' }, context)
            : service.patchMoment({ prompt: 'Change the title', content }, context)
        const payloads: LLMStreamPayload[] = []

        for await (const payload of stream) {
            if ('done' in payload) {
                expect(record).toHaveBeenCalledTimes(1)
            }
            payloads.push(payload)
        }

        expect(payloads).toEqual([{ chunk: JSON.stringify(content) }, { done: true, momentContent: content }])
        expect(complete).toHaveBeenCalledWith(expect.objectContaining({
            model: 'gpt-6.1-terra', stream_options: { include_usage: true },
        }))
        expect(record).toHaveBeenCalledWith(expect.objectContaining({
            operation: operation === 'generate' ? 'moment-generation' : 'moment-patch',
            response_id: 'stream-1',
            input_tokens: 100,
            output_tokens: 50,
        }))
    })

    it('records unknown stream usage if iteration ends early', async () => {
        complete.mockResolvedValue((async function* () {
            yield { id: 'stream-1', choices: [{ delta: { content: 'partial' } }] }
        })())
        const stream = service.generateMoment('A garden party', { heroImageUrl: 'https://example.com/image.png' }, context)

        await stream.next()
        await stream.return(undefined)

        expect(record).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
            response_id: 'stream-1', input_tokens: null, output_tokens: null,
        }))
    })

    it('records usage even when streamed content is malformed', async () => {
        complete.mockResolvedValue((async function* () {
            yield { id: 'stream-1', choices: [{ delta: { content: 'invalid JSON' } }] }
            yield { id: 'stream-1', choices: [], usage: { prompt_tokens: 100, completion_tokens: 50 } }
        })())
        const payloads: LLMStreamPayload[] = []

        for await (const payload of service.patchMoment({ prompt: 'Change the title', content }, context)) {
            payloads.push(payload)
        }

        expect(record).toHaveBeenCalledTimes(1)
        expect(payloads.at(-1)).toEqual({ error: 'Failed to generate a valid Moment.' })
    })

    it('logs cost-storage failures without changing successful responses', async () => {
        record.mockRejectedValue(new Error('Database unavailable'))
        complete.mockResolvedValue({
            id: 'chat-1',
            choices: [{ message: { content: '{"valid":true}' } }],
            usage: { prompt_tokens: 100, completion_tokens: 20 },
        })

        await expect(service.classifyPrompt('A garden party', context)).resolves.toEqual({ valid: true })
        expect(warn).toHaveBeenCalledWith(expect.objectContaining({
            operation: 'prompt-classification',
        }), '[OpenAIService] Failed to store AI cost')
    })
})
