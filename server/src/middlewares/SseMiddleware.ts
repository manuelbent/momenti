import { Request, Response, NextFunction } from 'express'

/**
 * @class SseMiddleware
 */
export default class SseMiddleware {
    /**
     * Sets the required headers for a Server-Sent Events response and flushes them
     * immediately so the client receives the stream opening before any data arrives.
     * @param {Request} _
     * @param {Response} res
     * @param {NextFunction} next
     */
    public async handle(_: Request, res: Response, next: NextFunction): Promise<void> {
        res.setHeader('Content-Type', 'text/event-stream')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        res.flushHeaders()
        next()
    }
}
