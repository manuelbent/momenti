import { Response } from 'express'

export const emit = (
    res: Response,
    event: string,
    data: unknown,
    end = false,
): void => {
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
    if (end) res.end()
}
