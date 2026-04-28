import { Router } from 'express'
import ioc from '../config/ioc'

const router = Router()

// api routes
router.post('/api/capture',
    (req, res, next) => ioc.generateMomentRequestValidator.validate(req, res, next),
    (req, res, next) => ioc.promptValidator.handle(req, res, next),
    (req, res) => ioc.momentController.capture(req, res)
)

// healthcheck
router.get('/healthcheck', ioc.systemController.healthcheck)

// 404
router.use(ioc.systemController.notFound)

export default router
