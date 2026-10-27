import { beforeEach, describe, expect, it, vi } from 'vitest'
import LLMService from './LLMService'

const { create } = vi.hoisted(() => ({
    create: vi.fn(),
}))

vi.mock('openai', () => ({
    default: class {
        chat = { completions: { create } }
    },
}))

describe('LLMService image prompt generation', () => {
    let service: LLMService

    beforeEach(() => {
        create.mockReset()
        service = new LLMService()
    })

    describe('LLMService page styling contract', () => {
        const content = {
            slug: 'supper-a1b2',
            fonts: ['DM Sans'],
            stylesheet: '#opening { display: grid; grid-template-columns: 2fr 1fr }',
            root: { id: 'opening', type: 'box' as const },
        }

        beforeEach(() => {
            create.mockReset()
            create.mockImplementation(async () => ({
                async *[Symbol.asyncIterator]() {
                    yield { choices: [{ delta: { content: JSON.stringify(content) } }] }
                },
            }))
        })

        it('streams and returns the stylesheet without changing the image pipeline', async () => {
            const service = new LLMService()
            const payloads = []
            for await (const payload of service.captureMoment('A supper club', 'https://images.example/supper.png')) {
                payloads.push(payload)
            }

            expect(payloads).toEqual([
                { chunk: JSON.stringify(content) },
                { done: true, momentContent: content },
            ])
            const request = create.mock.calls[0][0]
            expect(request.messages[0].content).toContain('OUTPUT CONTRACT')
            expect(request.messages[0].content).toContain('stylesheet?: string')
            expect(request.messages[0].content).toContain('There is no mandatory hero arrangement')
            expect(request.messages[1].content).toContain(
                '<HERO_IMAGE_URL>https://images.example/supper.png</HERO_IMAGE_URL>',
            )
        })

        it('supplies the same CSS contract and current stylesheet when patching', async () => {
            const service = new LLMService()
            const payloads = []
            for await (const payload of service.patchMoment({
                prompt: 'Make the opening wider',
                content,
                nodeId: 'opening',
            })) {
                payloads.push(payload)
            }

            const request = create.mock.calls[0][0]
            expect(request.messages[0].content).toContain('OUTPUT CONTRACT')
            expect(request.messages[0].content).toContain('Use @container moment')
            expect(request.messages[0].content).toContain('Never replace a real image with a placeholder')
            expect(request.messages[1].content).toContain(JSON.stringify(content))
            expect(payloads.at(-1)).toEqual({ done: true, momentContent: content })
        })
    })

    it('uses a low-cost model to create a visual-only hero prompt', async () => {
        create.mockResolvedValue({
            choices: [{
                message: {
                    content: '  A candlelit garden wedding at dusk, wide cinematic composition  ',
                },
            }],
        })

        await expect(service.generateImagePrompt('  Create a garden wedding page  '))
            .resolves.toBe('A candlelit garden wedding at dusk, wide cinematic composition')
        expect(create).toHaveBeenCalledWith({
            model: 'gpt-4.1-mini',
            messages: [
                {
                    role: 'system',
                    content: expect.stringContaining('never a website, webpage, user interface'),
                },
                { role: 'user', content: 'Create a garden wedding page' },
            ],
            temperature: 0.7,
        })
    })

    it('rejects an empty image prompt response', async () => {
        create.mockResolvedValue({
            choices: [{ message: { content: '   ' } }],
        })

        await expect(service.generateImagePrompt('Create a garden wedding page'))
            .rejects.toThrow('OpenAI did not return an image prompt.')
    })
})
