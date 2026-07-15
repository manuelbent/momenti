import path from 'node:path'
import pino from 'pino'

const destination = path.join('.', 'app.log')

export const transport = process.env.NODE_ENV === 'dev' ? undefined : {
    target: 'pino/file',
    options: {
        destination,
    }
}

const logger = pino({
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    transport,
})

export default logger
