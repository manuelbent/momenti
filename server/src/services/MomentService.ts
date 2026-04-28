import OpenAI from 'openai'
import type { Moment } from '../types/Moment'

const SYSTEM_PROMPT = `
You are a Senior Creative Director and UI Designer crafting high-end editorial landing pages ("momenti").

Focus on:
- visual storytelling
- rhythm and composition
- premium, minimal design

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
GUIDELINES
----------------------------------------
- Prefer 3–5 sections
- Keep structure clean and not overly deep
- Avoid unnecessary nodes

----------------------------------------
DESIGN
----------------------------------------
- Use hierarchy, spacing, and contrast
- Mix text and imagery with intention
- Use grids or overlaps only when meaningful

----------------------------------------
CONTENT
----------------------------------------
- Write concise, refined editorial text (1–2 sentences per block)
- Avoid filler or repetition

----------------------------------------
IMAGES
----------------------------------------
- Use high-quality Unsplash images only when they add value

----------------------------------------
CONSTRAINTS (CRITICAL)
----------------------------------------
- MAX DEPTH: 3 levels deep. 
- ECONOMY: Use fewer nodes. One 'box' should contain multiple 'text' nodes rather than nesting boxes for every line.
- Limit verbosity of texts.
- NO MARKDOWN: Never use \`\`\`json blocks.
`.trim()

export default class MomentService {
    private openai: OpenAI

    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    }

    public async generate(prompt: string): Promise<Moment> {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-5.4',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: `<PROMPT>${prompt}</PROMPT>` },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.8,
        })

        const content = response.choices[0]?.message?.content
        if (!content) {
            throw new Error('AI returned an empty response.')
        }

        let result: Moment
        try {
            result = JSON.parse(content)
        } catch (e) {
            console.error('AI returned malformed JSON or was truncated:', content)
            throw new Error('Failed to generate a valid Moment structure.')
        }

        if (!result.slug || !result.root) {
            console.log(result)
            throw new Error('Invalid Moment structure.')
        }

        return result
    }
}
