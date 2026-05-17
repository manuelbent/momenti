import express from 'express'
import cors from 'cors'

import router from './routes/router'
import ioc from './config/ioc'

const app = express()

app.enable('trust proxy')
app.use(cors())
app.use(express.json())

app.use(ioc.malformedDataMiddleware.handle)

app.use('/', router)

app.use(ioc.validationErrorMiddleware.handle)

export default app
