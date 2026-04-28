import OpenAI from 'openai'
import type { Moment } from '../types/Moment'

export default class MomentService {
    private openai: OpenAI

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    public async generate(prompt: string): Promise<Moment> {
        const creativeDirection = 'editorial luxury storytelling'

        const response = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            temperature: 0.8,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `
You are a world-class Senior UI/UX Designer, Creative Director, and Frontend Architect designing premium editorial landing pages for "momenti".

Your work must feel like a high-end magazine experience (Apple, Aesop, Airbnb Editorial).

----------------------------------------
OUTPUT FORMAT (STRICT)
----------------------------------------
Return ONLY a valid JSON object:

interface MomentNode {
  id: string;
  type: 'box'|'text'|'image'|'form';
  variant?: 'hero'|'section'|'grid'|'card'|'overlay';
  layout?: 'row'|'column'|'grid';
  columns?: number;
  css?: string;
  tag?: string;
  html?: string;
  src?: string;
  alt?: string;
  placeholder?: string;
  buttonLabel?: string;
  inputCss?: string;
  buttonCss?: string;
  children?: MomentNode[];
}

interface Moment {
  slug: string;
  root: MomentNode;
}

----------------------------------------
HARD REQUIREMENTS (NON-NEGOTIABLE)
----------------------------------------
- Minimum 5 DISTINCT top-level sections
- Each section MUST contain children
- Include:
  • 1 Hero section
  • 1 Story section
  • 1 Details section (structured/grid)
  • 1 Gallery (multiple images)
  • 1 RSVP / CTA form
- At least 3 images (all different)
- At least 1 grid layout (2–3 columns)
- At least 1 overlapping element using negative margins
- Rich nested structure (no flat layouts)

----------------------------------------
DESIGN SYSTEM
----------------------------------------
Typography:
- Headings → font-family: 'Playfair Display', serif
- Body/UI → font-family: 'Inter', system-ui

Spacing:
- Sections must use generous spacing: padding: 120px 24px

Colors:
- Use a refined palette (max 5 colors)
- Background example: #fdfaf7
- Text: #2d2d2d

Buttons:
- Must include hover states
- Must feel premium

----------------------------------------
IMAGES
----------------------------------------
- Use REALISTIC Unsplash URLs:
  https://images.unsplash.com/photo-XXXXXXXXXXXX?auto=format&fit=crop&w=1200&q=80
- Use different images every time
- Match images to the narrative (no generic placeholders)

----------------------------------------
LAYOUT INTELLIGENCE
----------------------------------------
- Use grid layouts for structure
- Use overlay cards on images
- Use negative margins for depth
- Alternate visual rhythm (image/text)

----------------------------------------
NARRATIVE FLOW
----------------------------------------
1. Hero → emotional impact
2. Story → context & meaning
3. Details → structured information
4. Gallery → immersion
5. RSVP → conversion

----------------------------------------
CREATIVE DIRECTION
----------------------------------------
Style: ${creativeDirection}

----------------------------------------
CONTENT RULES
----------------------------------------
- Expand minimal prompts into rich narratives
- Write evocative, editorial-quality copy
- Avoid generic filler text
- Make every section feel intentional

----------------------------------------
CRITICAL
----------------------------------------
- Output ONLY JSON
- No explanations
- No markdown
- No extra text
          `.trim(),
                },
                {
                    role: 'user',
                    content: `<PROMPT>${prompt}</PROMPT>`,
                },
            ],
        })

        const content = response.choices[0]?.message?.content

        if (!content) {
            throw new Error('AI returned an empty response.')
        }

        let result: Moment

        try {
            result = JSON.parse(content)
        } catch (err) {
            console.error('JSON PARSE ERROR:', content)
            throw new Error('Invalid JSON returned by AI.')
        }

        // ----------------------------------------
        // VALIDATION LAYER (IMPORTANT)
        // ----------------------------------------

        if (!result.slug || !result.root) {
            throw new Error('Invalid Moment structure.')
        }

        if (!result.root.children || result.root.children.length < 5) {
            throw new Error('Moment must contain at least 5 sections.')
        }

        const hasForm = JSON.stringify(result).includes('"type":"form"')
        const hasImage = JSON.stringify(result).includes('"type":"image"')

        if (!hasForm) {
            throw new Error('Moment must include a form section.')
        }

        if (!hasImage) {
            throw new Error('Moment must include images.')
        }

        return result
    }
}
