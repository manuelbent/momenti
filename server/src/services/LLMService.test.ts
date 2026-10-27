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
