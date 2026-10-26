import { describe, expect, it } from 'vitest'
import { createCreativeDirection } from './creativeDirection'

describe('createCreativeDirection', () => {
    it('combines independently selected opening, architecture, and rhythm cues', () => {
        const indexes = [1, 2, 3]

        const direction = createCreativeDirection(() => indexes.shift() ?? 0)

        expect(direction).toBe(
            'Opening: a split editorial opener with image and copy in deliberate tension. ' +
            'Architecture: use a narrative sequence of distinct editorial chapters. ' +
            'Rhythm: playful and syncopated with varied alignment and scale.',
        )
    })
})
