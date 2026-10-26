import { describe, expect, it } from 'vitest'
import { findGeneratedHeroImage } from './heroImage'

describe('findGeneratedHeroImage', () => {
    it('returns the first prompted image inside the hero', () => {
        const firstImage: MomentNode = {
            id: 'hero-image',
            type: 'image',
            generationPrompt: 'A candlelit garden',
        }
        const root: MomentNode = {
            id: 'root',
            type: 'box',
            children: [
                {
                    id: 'hero',
                    type: 'box',
                    variant: 'hero',
                    children: [
                        firstImage,
                        {
                            id: 'second-hero-image',
                            type: 'image',
                            generationPrompt: 'A second image',
                        },
                    ],
                },
            ],
        }

        expect(findGeneratedHeroImage(root)).toBe(firstImage)
    })

    it('ignores prompted images outside the hero', () => {
        const root: MomentNode = {
            id: 'root',
            type: 'box',
            children: [
                {
                    id: 'section',
                    type: 'box',
                    variant: 'section',
                    children: [
                        {
                            id: 'section-image',
                            type: 'image',
                            generationPrompt: 'Not eligible',
                        },
                    ],
                },
                {
                    id: 'hero',
                    type: 'box',
                    variant: 'hero',
                    children: [
                        {
                            id: 'hero-image',
                            type: 'image',
                            generationPrompt: 'Eligible',
                        },
                    ],
                },
            ],
        }

        expect(findGeneratedHeroImage(root)?.id).toBe('hero-image')
    })

    it('returns undefined when the hero has no non-empty generation prompt', () => {
        const root: MomentNode = {
            id: 'hero',
            type: 'box',
            variant: 'hero',
            children: [
                {
                    id: 'hero-image',
                    type: 'image',
                    generationPrompt: '  ',
                },
            ],
        }

        expect(findGeneratedHeroImage(root)).toBeUndefined()
    })
})
