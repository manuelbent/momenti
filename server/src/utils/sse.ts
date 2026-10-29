import { Response } from 'express'

export const emit = (
    res: Response,
    event: string,
    data: unknown,
    end = false,
    id?: string,
): void => {
    if (id !== undefined) res.write(`id: ${id}\n`)
    res.write(`event: ${event}\n`)
    res.write(`data: ${JSON.stringify(data)}\n\n`)
    if (end) res.end()
}
