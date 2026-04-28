import { Router } from 'express'
import container from '../config/ioc'

const router = Router()

// api routes
router.post('/api/moments/generate',
    (req, res, next) => container.generateMomentRequestValidator.validate(req, res, next),
    (req, res, next) => container.promptValidator.handle(req, res, next),
    (req, res) => container.momentController.generate(req, res)
)

// healthcheck
router.get('/healthcheck', container.systemController.healthcheck)

// 404
router.use(container.systemController.notFound)

export default router
