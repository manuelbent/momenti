import Redis from 'ioredis'
import logger from './logger'

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
    enableOfflineQueue: false,
    maxRetriesPerRequest: 0,
})

redis.on('error', (err) => {
    logger.error({ err }, '[redis] connection error')
})

export default redis
