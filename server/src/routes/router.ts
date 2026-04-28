import { Router } from 'express'

import systemController from '../controllers/SystemController'
import momentController from '../controllers/MomentController'
import promptValidator from '../middlewares/PromptValidator'

const router = Router()

// api routes
router.post('/api/moments/generate', promptValidator.handle, momentController.generate)

// healthcheck
router.get('/healthcheck', systemController.healthcheck)

// 404
router.use(systemController.notFound)

export default router
