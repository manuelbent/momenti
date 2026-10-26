import { randomInt } from 'node:crypto'

const OPENINGS = [
    'a type-led editorial opener with no hero image',
    'a split editorial opener with image and copy in deliberate tension',
    'a cinematic image-led opener with restrained text',
    'a minimal invitation-like opener built around whitespace',
    'an asymmetric poster-like opener with off-center typography',
    'a compact masthead that lets the first content section carry the visual impact',
]

const STRUCTURES = [
    'organize the page as a chronological guest journey',
    'build an essentials-first composition with details grouped into one strong module',
    'use a narrative sequence of distinct editorial chapters',
    'create one continuous visual canvas with details embedded as insets',
    'alternate quiet and expressive sections with noticeably different proportions',
    'lead with the response action, then reveal the event story and practical details',
]

const RHYTHMS = [
    'mostly sparse and spacious with one dense focal area',
    'compact and energetic with short, sharply separated beats',
    'calm and ceremonial with generous pauses',
    'playful and syncopated with varied alignment and scale',
    'magazine-like with a strong contrast between display moments and utility content',
]

type PickIndex = (upperBound: number) => number

export function createCreativeDirection(
    pickIndex: PickIndex = upperBound => randomInt(upperBound),
): string {
    return [
        `Opening: ${OPENINGS[pickIndex(OPENINGS.length)]}.`,
        `Architecture: ${STRUCTURES[pickIndex(STRUCTURES.length)]}.`,
        `Rhythm: ${RHYTHMS[pickIndex(RHYTHMS.length)]}.`,
    ].join(' ')
}
