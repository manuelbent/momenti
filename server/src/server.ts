import 'dotenv/config'

import app from './app'
import logger from './config/logger'

const port = Number(process.env.PORT) || 3000

app.listen(port, () => {
    logger.info(`momenti server running on port ${port}...`)
})
