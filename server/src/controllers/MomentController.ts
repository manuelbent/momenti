import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import path from 'path'
import MomentService from '../services/MomentService'
import type { Moment } from '../types/Moment'

const MOMENTS_DIR = path.resolve(process.cwd(), 'moments')

/**
 * @class MomentController
 */
export default class MomentController {
    /**
     * @constructor
     * @param {MomentService} momentService
     */
    constructor(private momentService: MomentService) {}

    /**
     * @param {Request} req
     * @param {Response} res
     */
    public async capture(req: Request, res: Response): Promise<void> {
        const { prompt } = req.body

        try {
            const moment = await this.momentService.generate(prompt.trim())
            await this.saveMoment(prompt.trim(), moment)
            res.status(200).json(moment)
        } catch (err) {
            console.error('[MomentController] Error:', err)
            res.status(500).json({ error: 'Failed to generate the Moment. Please try again.' })
        }
    }

    /**
     * Persists a moment to a txt file inside the moments/ directory.
     * @param {string} prompt
     * @param {unknown} moment
     */
    private async saveMoment(prompt: string, moment: Moment): Promise<void> {
        try {
            await fs.mkdir(MOMENTS_DIR, { recursive: true })
            const filename = `${Date.now()}-${moment['slug'] ?? 'moment'}.txt`
            const content = `PROMPT\n${prompt}\n\nMOMENT\n${JSON.stringify(moment, null, 2)}\n`
            await fs.writeFile(path.join(MOMENTS_DIR, filename), content, 'utf-8')
        } catch (err) {
            console.error('[MomentController] Failed to save moment to file:', err)
        }
    }
}
